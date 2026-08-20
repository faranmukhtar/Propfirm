# api/index.py (or api/main.py)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.psx import get_stock_price, get_all_stocks

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Serverless handles CORS via proxies, wildcard is safe
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/stock/{symbol}")
def stock_price(symbol: str):
    stock = get_stock_price(symbol)
    if stock is None:
        raise HTTPException(
            status_code=404,
            detail=f"Stock {symbol.upper()} not found"
        )
    return stock