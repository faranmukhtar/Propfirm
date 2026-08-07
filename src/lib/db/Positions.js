import db from './index';


export async function gettopstocks() {
  try {

    const { data, error } = await db
      .from('positions')
      .select(`
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
    console.error('Error fetching top stock symbols:', error);
    throw error;
  }
}


export async function getTotalInvestedCapital() {
  try {

    const { data, error } = await db
      .from('positions')
      .select(`
        qty,
        buy_price
      `);


    if (error) {
      throw error;
    }


    const total = data.reduce(
      (sum, row) => sum + (row.qty * row.buy_price),
      0
    );


    return Number(total);


  } catch (error) {
    console.error('Error calculating total investment:', error);
    throw error;
  }
}