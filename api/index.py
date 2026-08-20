from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .services.psx import get_stock_price, get_all_stocks

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use the /api prefix so Vercel's routing matches FastAPI's internal router
@app.get("/api/stock/{symbol}")
def stock_price(symbol: str):
    stock = get_stock_price(symbol)
    if stock is None:
        raise HTTPException(
            status_code=404,
            detail=f"Stock {symbol.upper()} not found"
        )
    # FastAPI will automatically convert this dict to JSON
    return {"symbol": symbol.upper(), "price": stock}