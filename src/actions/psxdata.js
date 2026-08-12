
export async function getStockPrice(symbol) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  
  const res = await fetch(`${baseUrl}/stock/${symbol}`, {
    
    cache: 'no-store' 
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch data from backend');
  }
  return res.json();
}

