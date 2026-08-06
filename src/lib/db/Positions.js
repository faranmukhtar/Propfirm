import db from './index';


export async function gettopstocks(){
    try{
        const[rows] = await db.query(
        `SELECT instrument_id
        FROM positions
        GROUP BY instrument_id
        ORDER BY SUM(QTY * buy_price) DESC
        LIMIT 4;
        `
        );
        return rows.map((row) => row.Symbol);
    } 
    catch (error) {
        console.error('Error fetching top stock symbols:', error);
        throw error;
    }
}


export async function getTotalInvestedCapital() {
  try {
    const [rows] = await db.query(
      `SELECT COALESCE(SUM(QTY * buy_price), 0) AS TotalInvested 
       FROM positions 
       `,
    );
    return Number(rows[0].TotalInvested);
  } catch (error) {
    console.error('Error calculating total investment:', error);
    throw error;
  }
}