import db from "./index";

export async function gettopstocks() {
  try {
    const { data, error } = await db.from("positions").select(`
        instrument_id,
        qty,
        buy_price
      `);

    if (error) {
      throw error;
    }

    const totals = {};

    data.forEach((row) => {
      if (!totals[row.instrument_id]) {
        totals[row.instrument_id] = 0;
      }

      totals[row.instrument_id] += row.qty * row.buy_price;
    });

    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([instrument_id]) => Number(instrument_id));
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
    const { data, error } = await db.from("positions").select("*");

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error getting positions:", error);
    throw error;
  }
}

export async function getpositionsbyid(id) {
  try {
    const { data, error } = await db
      .from("positions")
      .select("*")
      .eq("trader_id", id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error getting positions:", error);
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
