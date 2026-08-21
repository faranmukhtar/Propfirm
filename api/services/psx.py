import os
import tempfile
import requests
import pandas as pd
import psxdata
from typing import Optional, List

# Redirect any library cache writes to Vercel's writable /tmp directory
os.environ["TMPDIR"] = tempfile.gettempdir()

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest",
    "Referer": "https://dps.psx.com.pk/",
}

def get_stock_price(symbol: str) -> Optional[float]:
    symbol_clean = symbol.upper().strip()

    # Strategy 1: Direct JSON API call with browser headers (Primary for Vercel)
    try:
        url = f"https://dps.psx.com.pk/timeseries/int/{symbol_clean}"
        res = requests.get(url, headers=HEADERS, timeout=8)

        if res.status_code == 200:
            payload = res.json()
            # PSX returns data format: {"status": 1, "data": [[timestamp, price, volume], ...]}
            if payload.get("status") == 1 and payload.get("data"):
                latest_trade = payload["data"][-1]
                price = float(latest_trade[1])
                if price > 0:
                    return price
    except Exception as err:
        print(f"[PSX Direct Error] {symbol_clean}: {err}")

    # Strategy 2: Fallback to psxdata library
    try:
        quote = psxdata.quote(symbol_clean)
        if quote is not None and isinstance(quote, pd.DataFrame) and not quote.empty:
            if 'price' in quote.columns and not quote['price'].empty:
                val = float(quote.iloc[0]['price'])
                if val > 0:
                    return val
    except Exception as err:
        print(f"[psxdata Fallback Error] {symbol_clean}: {err}")

    return None


def get_all_stocks() -> Optional[List[str]]:
    try:
        url = "https://dps.psx.com.pk/symbols"
        res = requests.get(url, headers=HEADERS, timeout=8)
        if res.status_code == 200:
            data = res.json()
            if isinstance(data, list):
                return [item["symbol"] for item in data if "symbol" in item]
    except Exception as err:
        print(f"[PSX Tickers Direct Error]: {err}")

    # Fallback to psxdata
    try:
        return psxdata.tickers()
    except Exception as err:
        print(f"[psxdata Tickers Fallback Error]: {err}")
        return None