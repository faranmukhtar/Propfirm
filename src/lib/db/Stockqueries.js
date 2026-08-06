// import {db}from '@/lib/db/index'; // Your MySQL pool connection

// /**
//  * 1. GET ALL STOCKS FOR A TRADER
//  */
// export async function getStocksByTrader(traderId) {
//   try {
//     const [rows] = await db.query(
//       `SELECT Stockid, Traderid, Companyname, Symbol, Quantity, BuyingPrice 
//        FROM stocks 
//        WHERE Traderid = ?`,
//       [traderId]
//     );
//     return rows;
//   } catch (error) {
//     console.error('Error fetching trader stocks:', error);
//     throw error;
//   }
// }

// /**
//  * 2. GET SINGLE STOCK BY SYMBOL
//  */
// export async function getStockBySymbol(traderId, symbol) {
//   try {
//     const [rows] = await db.query(
//       `SELECT Stockid, Symbol, Companyname, Quantity, BuyingPrice 
//        FROM stocks 
//        WHERE Traderid = ? AND Symbol = ?`,
//       [traderId, symbol.toUpperCase()]
//     );
//     return rows[0] || null;
//   } catch (error) {
//     console.error('Error fetching stock:', error);
//     throw error;
//   }
// }

// /**
//  * 3. BUY / ADD STOCK (With Weighted Average Buying Price Calculation)
//  * If the stock already exists in portfolio, it updates Quantity and recalculates Avg Price.
//  * If new, it inserts a new row.
//  */
// export async function buyStock(traderId, symbol, companyName, newQty, newPrice) {
//   try {
//     const existing = await getStockBySymbol(traderId, symbol);

//     if (existing) {
//       // Calculate new weighted average buying price
//       const totalOldCost = existing.Quantity * Number(existing.BuyingPrice);
//       const totalNewCost = newQty * newPrice;
//       const combinedQty = existing.Quantity + newQty;
//       const newAvgPrice = (totalOldCost + totalNewCost) / combinedQty;

//       const [result] = await db.query(
//         `UPDATE stocks 
//          SET Quantity = ?, BuyingPrice = ? 
//          WHERE Stockid = ?`,
//         [combinedQty, newAvgPrice.toFixed(2), existing.Stockid]
//       );
//       return { action: 'updated', affectedRows: result.affectedRows };
//     } else {
//       // Insert new stock position
//       const [result] = await db.query(
//         `INSERT INTO stocks (Traderid, Companyname, Symbol, Quantity, BuyingPrice) 
//          VALUES (?, ?, ?, ?, ?)`,
//         [traderId, companyName, symbol.toUpperCase(), newQty, newPrice]
//       );
//       return { action: 'inserted', insertId: result.insertId };
//     }
//   } catch (error) {
//     console.error('Error buying stock:', error);
//     throw error;
//   }
// }

// /**
//  * 4. SELL STOCK (Partial Sell or Full Delete)
//  */
// export async function sellStock(stockId, sellQty) {
//   try {
//     const [rows] = await db.query(
//       `SELECT Quantity FROM stocks WHERE Stockid = ?`,
//       [stockId]
//     );

//     if (rows.length === 0) throw new Error('Stock position not found');

//     const currentQty = rows[0].Quantity;

//     if (sellQty >= currentQty) {
//       // Sold all shares -> Delete row completely
//       const [result] = await db.query(`DELETE FROM stocks WHERE Stockid = ?`, [stockId]);
//       return { action: 'deleted', affectedRows: result.affectedRows };
//     } else {
//       // Sold partial shares -> Reduce quantity
//       const remainingQty = currentQty - sellQty;
//       const [result] = await db.query(
//         `UPDATE stocks SET Quantity = ? WHERE Stockid = ?`,
//         [remainingQty, stockId]
//       );
//       return { action: 'reduced', remainingQty, affectedRows: result.affectedRows };
//     }
//   } catch (error) {
//     console.error('Error selling stock:', error);
//     throw error;
//   }
// }
