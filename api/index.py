from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
# Use relative import since services/ is inside the api/ folder
from .services.psx import get_stock_price, get_all_stocks

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route is /stock/{symbol} (Vercel automatically prepends /api)
@app.get("/stock/{symbol}")
def stock_price(symbol: str):
    stock = get_stock_price(symbol)
    if stock is None:
        raise HTTPException(
            status_code=404,
            detail=f"Stock {symbol.upper()} not found"
        )
    return stock