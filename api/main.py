from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.psx import get_stock_price, get_all_stocks

app = FastAPI()

# Define all the URLs that are allowed to talk to your backend
origins = [
    "http://localhost:3000",            # Your local development environment
    "http://127.0.0.1:3000",            # Alternative local address
    "https://propfirm-pi.vercel.app/" # Replace this with your actual Vercel URL!
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stock/{symbol}")
def stock_price(symbol: str):
    stock = get_stock_price(symbol)
    if stock is None:
        raise HTTPException(
            status_code=404,
            detail=f"Stock {symbol.upper()} not found"
        )
    return stock