import os
import tempfile

# psxdata's disk cache lives at ~/.psxdata/cache — resolved from $HOME,
# NOT $TMPDIR. Vercel's filesystem is read-only except /tmp, so this needs
# to happen before `import psxdata`, or cache writes fail silently inside
# the library on every call that touches it (get_all_stocks, quote, etc).
os.environ["HOME"] = tempfile.gettempdir()
os.environ["TMPDIR"] = tempfile.gettempdir()

import re
import requests
import psxdata
from typing import Optional

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://dps.psx.com.pk/",
}

def get_stock_price(symbol: str) -> Optional[float]:
    symbol_clean = symbol.upper().strip()

    # 0. psxdata's own quote() - has retries and caching already built in
    try:
        q = psxdata.quote(symbol_clean)
        if q is not None and not q.empty:
            print(f"[psxdata.quote] {symbol_clean} cols={q.columns.tolist()}")  # check once, then trim
            row = q.iloc[0]
            for col in ("price", "current", "rate", "close", "ldcp"):
                if col in row and float(row[col]) > 0:
                    return float(row[col])
    except Exception as err:
        print(f"[psxdata.quote Failed] {symbol_clean}: {type(err).__name__}: {err}")

    # 1. Direct Intraday JSON API
    try:
        url = f"https://dps.psx.com.pk/timeseries/int/{symbol_clean}"
        res = requests.get(url, headers=HEADERS, timeout=4)
        print(f"[Intraday] {symbol_clean}: HTTP {res.status_code} body={res.text[:120]!r}")
        if res.status_code == 200:
            data = res.json()
            if data.get("status") == 1 and data.get("data"):
                price = float(data["data"][-1][1])
                if price > 0:
                    return price
    except Exception as err:
        print(f"[Intraday API Failed] {symbol_clean}: {type(err).__name__}: {err}")

    # 2. Company HTML page scrape
    try:
        url = f"https://dps.psx.com.pk/company/{symbol_clean}"
        res = requests.get(url, headers=HEADERS, timeout=4)
        print(f"[HTML Scrape] {symbol_clean}: HTTP {res.status_code} len={len(res.text)}")
        if res.status_code == 200:
            match = re.search(r'class="quote__price"[^>]*>\s*Rs\.?\s*([\d\.]+)', res.text, re.IGNORECASE)
            if match:
                price = float(match.group(1))
                if price > 0:
                    return price
    except Exception as err:
        print(f"[HTML Scrape Failed] {symbol_clean}: {type(err).__name__}: {err}")

    # 3. Fallback EOD timeseries API
    try:
        url = f"https://dps.psx.com.pk/timeseries/eod/{symbol_clean}"
        res = requests.get(url, headers=HEADERS, timeout=4)
        print(f"[EOD] {symbol_clean}: HTTP {res.status_code} body={res.text[:120]!r}")
        if res.status_code == 200:
            data = res.json()
            if data.get("status") == 1 and data.get("data"):
                price = float(data["data"][-1][1])
                if price > 0:
                    return price
    except Exception as err:
        print(f"[EOD API Failed] {symbol_clean}: {type(err).__name__}: {err}")

    return None