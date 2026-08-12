import db from "./index";

// lib/db/Positions.js

export async function gettopstocks() {
  try {
    const { data, error } = await db.from("positions").select(`
        qty,
        buy_price,
        instruments (
          symbol
        )
      `);

    if (error) {
      throw error;
    }

    const totals = {};

    data.forEach((row) => {
      // Extract symbol from the joined instruments table
      const symbol = row.instruments?.symbol;
      if (!symbol) return;

      if (!totals[symbol]) {
        totals[symbol] = { totalCost: 0, totalQty: 0 };
      }

      totals[symbol].totalCost += row.qty * row.buy_price;
      totals[symbol].totalQty += row.qty;
    });

    // Return array of objects with symbol and calculated average buy price
    return Object.entries(totals)
      .map(([symbol, metrics]) => ({
        symbol: symbol,
        avgBuyPrice: metrics.totalQty > 0 ? metrics.totalCost / metrics.totalQty : 0,
        totalInvested: metrics.totalCost,
      }))
      .sort((a, b) => b.totalInvested - a.totalInvested)
      .slice(0, 4);
      
  } catch (error) {
    console.error("Error fetching top stock symbols:", error);
    throw error;
  }
}

export async function getTotalInvestedCapital() {
  try {
    const { data, error } = await db.from("positions").select(`
        qty,
        buy_price
      `);
    if (error) {
      throw error;
    }
    const total = data.reduce((sum, row) => sum + row.qty * row.buy_price, 0);
    return Number(total);
  } catch (error) {
    console.error("Error calculating total investment:", error);
    throw error;
  }
}

export async function getallpositions() {
  try {
    const { data, error } = await db
      .from("positions")
      .select(`
        *,
        instruments (
          id,
          symbol,
          company_name
        )
      `);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting positions:", error);
    throw error;
  }
}

export async function getpositionsbyid(traderId) {
  try {
    const { data, error } = await db
      .from("positions")
      .select(`
        *,
        instruments (
          id,
          symbol,
          company_name
        )
      `)
      .eq("trader_id", traderId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error getting positions for trader ${traderId}:`, error);
    throw error;
  }
}

export async function addPosition(
  trader_id,
  instrument_id,
  qty,
  buy_price,
  opened_at = null,
) {
  const position = {
    trader_id,
    instrument_id,
    qty,
    buy_price,
  };

  // Only include opened_at if one was explicitly provided
  if (opened_at) {
    position.opened_at = opened_at;
  }

  const { data, error } = await db
    .from("positions")
    .insert(position)
    .select()
    .single();

  if (error) {
    console.error("Error adding position:", error);
    throw error;
  }

  return data;
}
