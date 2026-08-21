import os
import tempfile
import re
import requests
import pandas as pd
import psxdata
from typing import Optional, List, Dict, Any

os.environ["TMPDIR"] = tempfile.gettempdir()

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://dps.psx.com.pk/",
}

def get_stock_price(symbol: str) -> Optional[float]:
    symbol_clean = symbol.upper().strip()

    # 1. Direct Intraday JSON API
    try:
        url = f"https://dps.psx.com.pk/timeseries/int/{symbol_clean}"
        res = requests.get(url, headers=HEADERS, timeout=5)
        if res.status_code == 200:
            data = res.json()
            if data.get("status") == 1 and data.get("data"):
                price = float(data["data"][-1][1])
                if price > 0:
                    return price
    except Exception as err:
        print(f"[Intraday API Failed] {symbol_clean}: {err}")

    # 2. Company HTML Page Scrape (Alternative route often unblocked)
    try:
        url = f"https://dps.psx.com.pk/company/{symbol_clean}"
        res = requests.get(url, headers=HEADERS, timeout=5)
        if res.status_code == 200:
            match = re.search(r'class="quote__price"[^>]*>\s*Rs\.?\s*([\d\.]+)', res.text, re.IGNORECASE)
            if match:
                price = float(match.group(1))
                if price > 0:
                    return price
    except Exception as err:
        print(f"[HTML Scrape Failed] {symbol_clean}: {err}")

    # 3. Fallback to EOD Timeseries API
    try:
        url = f"https://dps.psx.com.pk/timeseries/eod/{symbol_clean}"
        res = requests.get(url, headers=HEADERS, timeout=5)
        if res.status_code == 200:
            data = res.json()
            if data.get("status") == 1 and data.get("data"):
                price = float(data["data"][-1][1])
                if price > 0:
                    return price
    except Exception as err:
        print(f"[EOD API Failed] {symbol_clean}: {err}")

    return None