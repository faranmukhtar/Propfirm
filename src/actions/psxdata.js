export async function getStockPrice(symbol) {
  const getBaseUrl = () => {
    // 1. Explicit variable set in Vercel settings
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    
    // 2. Vercel deployment URL during Server-Side Rendering
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    
    // 3. Localhost fallback for local dev
    return 'http://127.0.0.1:8000';
  };

  const baseUrl = getBaseUrl();
  
  // Note: Match the route path configured in FastAPI (/api/stock/ vs /stock/)
  const res = await fetch(`${baseUrl}/api/stock/${symbol}`, {
    cache: 'no-store' 
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch data from backend');
  }
  
  return res.json();
}