import psxdata
import pandas as pd
from typing import Optional, Dict, Any, List

# services/psx.py

def get_stock_price(symbol: str):
    quote = psxdata.quote(symbol.upper())

    if quote is None or quote.empty:
        return None

    # Return only the float value of the price column
    return float(quote.iloc[0]['price'])


def get_all_stocks() -> Optional[List[str]]:
  
    try:
        tickers = psxdata.tickers()
        return tickers
        
    except Exception as e:
        print(f"Error fetching tickers: {e}")
        return None