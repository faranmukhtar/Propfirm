
import { db } from '@/lib/db'; 
import { getLatestPrice } from '@/lib/psx/psx';

async function getUserPortfolio(traderId) {
  // 1. Get symbols & stock holdings from Database
  const [rows] = await db.query(
    'SELECT Stockid, Symbol, Companyname, Quantity, BuyingPrice FROM stocks WHERE Traderid = ?',
    [traderId]
  );

  // 2. Fetch PSX prices in parallel for all symbols
  const portfolioWithPrices = await Promise.all(
    rows.map(async (stock) => {
      const currentPrice = await getLatestPrice(stock.Symbol);
      console.log(currentPrice)
      const livePrice = currentPrice !== null ? currentPrice : Number(stock.BuyingPrice);
      
      const totalInvestment = stock.Quantity * Number(stock.BuyingPrice);
      const currentValue = stock.Quantity * livePrice;
      const profitLoss = currentValue - totalInvestment;

      return {
        ...stock,
        currentPrice: livePrice,
        totalInvestment,
        currentValue,
        profitLoss,
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
  const totalInvested = portfolio.reduce((acc, item) => acc + item.totalInvestment, 0);
  const totalValue = portfolio.reduce((acc, item) => acc + item.currentValue, 0);
  const totalProfitLoss = totalValue - totalInvested;

  return (
    <div className="max-w-6xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-emerald-400">Stock Portfolio</h1>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
          <p className="text-sm text-gray-400">Total Investment</p>
          <p className="text-2xl font-bold mt-1">PKR {totalInvested.toLocaleString()}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
          <p className="text-sm text-gray-400">Current Value</p>
          <p className="text-2xl font-bold mt-1">PKR {totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
          <p className="text-sm text-gray-400">Total Profit / Loss</p>
          <p className={`text-2xl font-bold mt-1 ${totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalProfitLoss >= 0 ? '+' : ''}PKR {totalProfitLoss.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stocks Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-800 text-gray-400 uppercase text-xs">
            <tr>
              <th className="p-4">Symbol</th>
              <th className="p-4">Company</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Avg Buy Price</th>
              <th className="p-4">Current Price</th>
              <th className="p-4">Current Value</th>
              <th className="p-4">P/L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {portfolio.map((stock) => (
              <tr key={stock.Stockid} className="hover:bg-neutral-800/50">
                <td className="p-4 font-bold text-emerald-400">{stock.Symbol}</td>
                <td className="p-4 text-gray-300">{stock.Companyname}</td>
                <td className="p-4">{stock.Quantity}</td>
                <td className="p-4">PKR {Number(stock.BuyingPrice).toFixed(2)}</td>
                <td className="p-4 font-semibold">PKR {stock.currentPrice.toFixed(2)}</td>
                <td className="p-4">PKR {stock.currentValue.toLocaleString()}</td>
                <td className={`p-4 font-semibold ${stock.profitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stock.profitLoss >= 0 ? '+' : ''}{stock.profitLoss.toFixed(2)}
                </td>
              </tr>
            ))}

            {portfolio.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No stocks found in portfolio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}