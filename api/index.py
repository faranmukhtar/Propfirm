import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Ensure the 'api' directory is on the sys.path for Vercel Serverless
sys.path.append(str(Path(__file__).resolve().parent))

from services.psx import get_stock_price, get_all_stocks

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check route (Visit https://YOUR-VERCEL-DOMAIN.vercel.app/api to test)
@app.get("/api")
@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "FastAPI is running on Vercel"}

# Dual route decorators prevent 404s if Vercel strips or preserves the /api prefix
@app.get("/api/stock/{symbol}")
@app.get("/stock/{symbol}")
def stock_price(symbol: str):
    stock = get_stock_price(symbol)
    if stock is None:
        raise HTTPException(
            status_code=404,
            detail=f"Stock {symbol.upper()} not found or unavailable"
        )
    return {"symbol": symbol.upper(), "price": stock}

# Endpoint for get_all_stocks (previously imported but unused)
@app.get("/api/stocks")
@app.get("/stocks")
def all_stocks():
    stocks = get_all_stocks()
    if not stocks:
        raise HTTPException(status_code=500, detail="Failed to fetch stock list")
    return {"tickers": stocks}