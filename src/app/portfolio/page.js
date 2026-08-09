import InnerNav from "@/components/InnerNav";
import { createClient } from "@/lib/supabase/server";
import { getallpositions, getpositionsbyid } from "@/lib/db/Positions";
import { getCustomerById } from "@/lib/db/Customerqueries";
import { redirect } from "next/navigation";
import { getTraderById } from "@/lib/db/Traderqueries";
import { getuserbyid } from "@/lib/db/Users";
import AddStockPopup from "@/components/Addstockpopup";
import RequestInstrumentapproval from "@/components/RequestInstrumentapproval";


function formatPKR(value) {
  return `PKR ${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export default async function PortfolioPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/customerlogin");
  }

  const appUser = await getuserbyid(user.id);
  const role = appUser.role_id;
  const isCustomer = role === 1;
  const isTrader = role === 2;

  const rawPortfolio = isTrader
    ? await getpositionsbyid(appUser.id)
    : await getallpositions();

  // Ensure portfolio is an array even if the DB returns null
  const portfolio = rawPortfolio || [];

  console.log("MY DATABASE ROW LOOKS LIKE THIS:", portfolio[0]);
  const userdetails = isCustomer
    ? await getCustomerById(appUser.id)
    : isTrader
      ? await getTraderById(appUser.id)
      : null;

  const enrichedPortfolio = portfolio.map((stock) => {
    const qty = Number(stock.qty || stock.Quantity || 0);
    const buyPrice = Number(stock.buy_price || stock.BuyingPrice || 0);
    const currentPrice = Number(stock.current_price || stock.currentPrice || buyPrice);

    const investedValue = qty * buyPrice;
    const currentValue = qty * currentPrice;
    const profitLoss = currentValue - investedValue;
    const profitLossPercent = investedValue > 0 ? (profitLoss / investedValue) * 100 : 0;

    // Read directly from the joined relation object
    const symbol = stock.instruments?.symbol || "N/A";
    const company = stock.instruments?.company_name || stock.instruments?.name || "Unknown";

    return {
      ...stock,
      safeId: stock.id || Math.random().toString(),
      safeSymbol: symbol,
      safeCompany: company,
      safeQty: qty,
      safeBuyPrice: buyPrice,
      safeCurrentPrice: currentPrice,
      currentValue,
      profitLoss,
      profitLossPercent,
    };
  });
    

  // 2. Calculate dynamic totals using the clean data
  const totalInvested = enrichedPortfolio.reduce((sum, stock) => sum + (stock.safeQty * stock.safeBuyPrice), 0);
  const totalCurrentValue = enrichedPortfolio.reduce((sum, stock) => sum + stock.currentValue, 0);
  const totalProfitLoss = totalCurrentValue - totalInvested;
  const totalProfitLossPercent = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;
  const isProfitable = totalProfitLoss >= 0;

  return (
    <div>
      <InnerNav user={appUser} />
      <div className="w-full min-h-screen bg-black text-white flex justify-center p-6">
        <div className="w-full max-w-7xl">
          <h1 className="text-3xl font-bold mb-6 text-emerald-400">
            Stock Portfolio
          </h1>

          {/* Portfolio Summary Card */}
          <div className="mb-3">
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl w-full">
              <p className="text-sm text-gray-400 font-medium">
                Total Investment
              </p>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-4">
                <p className="text-4xl font-bold">{formatPKR(totalInvested)}</p>

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
                <p className={`text-2xl font-bold ${isProfitable ? "text-emerald-400" : "text-red-400"}`}>
                  {isProfitable ? "+" : ""}
                  {formatPKR(totalProfitLoss)}
                </p>
                <span className={`text-sm font-semibold ${isProfitable ? "text-emerald-400" : "text-red-400"}`}>
                  ({isProfitable ? "+" : ""}{totalProfitLossPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {!isCustomer && (
            <div className="flex align-middle justify-center gap-2 font-semibold">
              <div className="m-3 mb-5 bg-emerald-800 w-1/3 h-16 rounded-2xl hover:bg-emerald-500 flex items-center justify-center">
                <AddStockPopup traderId={appUser.id} className="w-full h-full">
                  <button
                    type="button"
                    className="w-full h-full flex items-center justify-center text-center"
                  >
                    Add Stock
                  </button>
                </AddStockPopup>
              </div>

              {isTrader && (
                <div className="m-3 mb-5 w-1/3 h-16 rounded-2xl bg-yellow-600 hover:bg-yellow-500">
                  <RequestInstrumentapproval>
                    <button
                      type="button"
                      className="w-full h-full flex items-center justify-center text-center px-2"
                    >
                      <span className="whitespace-normal break-words leading-tight">
                        Request Instrument Approval
                      </span>
                    </button>
                  </RequestInstrumentapproval>
                </div>
              )}
            </div>
          )}

          {/* Holdings Table */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
            <h2 className="p-4 text-xl font-semibold border-b border-neutral-800">
              Holdings
            </h2>

            <div className="max-h-[500px] overflow-auto">
              {enrichedPortfolio.length === 0 ? (
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
                    {enrichedPortfolio.map((stock) => (
                      <tr key={stock.safeId} className="hover:bg-neutral-800/50 transition-colors">
                        <td className="p-4 font-bold text-emerald-400">{stock.safeSymbol}</td>
                        <td className="p-4 text-gray-300">{stock.safeCompany}</td>
                        <td className="p-4">{stock.safeQty}</td>
                        <td className="p-4">PKR {stock.safeBuyPrice.toFixed(2)}</td>
                        <td className="p-4 font-semibold">PKR {stock.safeCurrentPrice.toFixed(2)}</td>
                        <td className="p-4">{formatPKR(stock.currentValue)}</td>
                        <td className={`p-4 font-semibold ${stock.profitLoss >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {stock.profitLoss >= 0 ? "+" : ""}
                          {stock.profitLoss.toFixed(2)}
                        </td>
                        <td className={`p-4 font-semibold ${stock.profitLossPercent >= 0 ? "text-emerald-500" : "text-red-500"}`}>
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