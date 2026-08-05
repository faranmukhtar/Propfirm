import { db } from '@/lib/db'; 
import { getLatestPrice } from '@/lib/psx/psx';
import InnerNav from '@/components/InnerNav';

async function getUserPortfolio(traderId) {
  // 1. Get stock holdings from Database
  const [rows] = await db.query(
    'SELECT Stockid, Symbol, Companyname, Quantity, BuyingPrice FROM stocks WHERE Traderid = ?',
    [traderId]
  );

  if (!rows || rows.length === 0) return [];

  // 2. Fetch PSX prices in parallel with fallback error handling
  const portfolioWithPrices = await Promise.all(
    rows.map(async (stock) => {
      // Safely parse numbers (MySQL DECIMAL types often return as strings)
      const buyingPrice = Number(stock.BuyingPrice) || 0;
      const quantity = Number(stock.Quantity) || 0;
      let livePrice = buyingPrice;

      try {
        const fetchedPrice = await getLatestPrice(stock.Symbol);
        if (fetchedPrice !== null && !isNaN(fetchedPrice)) {
          livePrice = Number(fetchedPrice);
        }
      } catch (err) {
        console.error(`Failed to fetch live price for ${stock.Symbol}:`, err);
      }

      const totalInvestment = quantity * buyingPrice;
      const currentValue = quantity * livePrice;
      const profitLoss = currentValue - totalInvestment;
      const profitLossPercent = totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;

      return {
        ...stock,
        Quantity: quantity,
        BuyingPrice: buyingPrice,
        currentPrice: livePrice,
        totalInvestment,
        currentValue,
        profitLoss,
        profitLossPercent,
      };
    })
  );

  return portfolioWithPrices;
}

export default async function PortfolioPage() {
  // Replace with dynamic user/trader ID from session/auth
  const traderId = 1;
  const portfolio = await getUserPortfolio(traderId);

  // Calculate Overall Portfolio Totals
  const totalInvested = 60000;
  const totalValue = 63000;
  const totalProfitLoss = totalValue - totalInvested;
  const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  return (
    <div>
      <InnerNav />
      <div className="w-full min-h-screen bg-black text-white flex justify-center p-6">
        <div className="w-full max-w-7xl">
          <h1 className="text-3xl font-bold mb-6 text-emerald-400">
            Stock Portfolio
          </h1>

          {/* Portfolio Summary Card */}
          <div className="mb-8">
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl w-full">
              <p className="text-sm text-gray-400 font-medium">Total Investment</p>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-4">
                <p className="text-4xl font-bold">
                  PKR {totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>

                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    <p className="text-gray-300">Profitable</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <p className="text-gray-300">At Loss</p>
                  </div>
                </div>
              </div>

              {/* Profit / Loss Readout */}
              <div className="mt-4 flex items-baseline gap-3">
                <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {totalProfitLoss >= 0 ? "+" : ""}
                  PKR {totalProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
                <span className={`text-sm font-semibold ${totalProfitLoss >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  ({totalProfitLoss >= 0 ? "+" : ""}{totalProfitLossPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <h2 className="p-4 text-xl font-semibold border-b border-neutral-800">Holdings</h2>
            
            <div className="max-h-[500px] overflow-auto">
              {portfolio.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No stock holdings found in your portfolio.
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-neutral-800 text-gray-400 uppercase text-xs">
                    <tr>
                      <th className="p-4">Symbol</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Shares</th>
                      <th className="p-4">Avg Buy Price</th>
                      <th className="p-4">Current Price</th>
                      <th className="p-4">Current Value</th>
                      <th className="p-4">P/L (PKR)</th>
                      <th className="p-4">P/L (%)</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-800">
                    {portfolio.map((stock) => (
                      <tr key={stock.Stockid} className="hover:bg-neutral-800/50 transition-colors">
                        <td className="p-4 font-bold text-emerald-400">{stock.Symbol}</td>
                        <td className="p-4 text-gray-300">{stock.Companyname}</td>
                        <td className="p-4">{stock.Quantity}</td>
                        <td className="p-4">PKR {stock.BuyingPrice.toFixed(2)}</td>
                        <td className="p-4 font-semibold">PKR {stock.currentPrice.toFixed(2)}</td>
                        <td className="p-4">PKR {stock.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className={`p-4 font-semibold ${stock.profitLoss >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {stock.profitLoss >= 0 ? "+" : ""}
                          {stock.profitLoss.toFixed(2)}
                        </td>
                        <td className={`p-4 font-semibold ${stock.profitLossPercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {stock.profitLossPercent >= 0 ? "+" : ""}
                          {stock.profitLossPercent.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}