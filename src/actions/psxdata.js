export async function getStockPrice(symbol) {
  const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return 'http://127.0.0.1:8000';
  };

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/stock/${symbol}`;
  
  const res = await fetch(url, { cache: 'no-store' });

  // Read response as text first to avoid the "<!DOCTYPE" crash
  const text = await res.text();

  if (!res.ok) {
    if (res.status === 404) return null;
    console.error(`[Backend Error] Expected JSON but got:`, text.slice(0, 150));
    throw new Error('Failed to fetch data from backend');
  }
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error(`[Parse Error] Received invalid JSON from ${url}:`, text.slice(0, 150));
    return null;
  }
}