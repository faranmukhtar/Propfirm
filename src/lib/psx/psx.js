// src/lib/psx/psx.js

export async function getLatestPrice(symbol) {
  if (!symbol) return null;
  const cleanSymbol = symbol.trim().toUpperCase();

  try {
    const res = await fetch(`https://dps.psx.com.pk/timeseries/eod/${cleanSymbol}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
      },
      cache: 'no-store', // Disable cache while testing to avoid cached nulls
    });

    if (!res.ok) {
      console.error(`[PSX API] HTTP Error ${res.status} for symbol: ${cleanSymbol}`);
      return null;
    }

    const json = await res.json();

    // PSX wraps time-series array inside { data: [...] }
    const timeSeries = Array.isArray(json) 
      ? json 
      : (Array.isArray(json?.data) ? json.data : null);

    if (!timeSeries || timeSeries.length === 0) {
      console.error(`[PSX API] Empty price history for symbol: ${cleanSymbol}`);
      return null;
    }

    // Get the most recent trading entry
    const latest = timeSeries[timeSeries.length - 1];

    // Handle Array format: [timestamp, open, high, low, close, volume]
    if (Array.isArray(latest) && latest[4] !== undefined) {
      return Number(latest[4]); // Index 4 is Close Price
    }

    // Handle Object format: { close: 120.5 }
    if (typeof latest === 'object' && latest !== null) {
        console.log(latest)
      return Number(latest.close || latest.price || 0);
    }

    return null;
  } catch (error) {
    console.error(`[PSX API] Fetch error for ${cleanSymbol}:`, error.message);
    return null;
  }
}

export async function gettotalvalue(){
    
}