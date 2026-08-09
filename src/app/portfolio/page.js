import { db } from "@/lib/db";
import { getLatestPrice } from "@/lib/psx/psx";
import InnerNav from "@/components/InnerNav";
import { createClient } from "@/lib/supabase/server";
import { getallpositions, getpositionsbyid } from "@/lib/db/Positions";
import { gettotalinvestments, getCustomerById } from "@/lib/db/Customerqueries";
import { redirect } from "next/navigation";
import { getTraderById } from "@/lib/db/Traderqueries";
import AddStockPopup from "@/components/Addstockpopup";
import RequestInstrumentapproval from "@/components/RequestInstrumentapproval"

export default async function PortfolioPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/customerlogin");
  }

  const { data: appUser, error } = await db
    .from("users")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  let userdetails = null;
  let totalValue = 0;
  let totalInvested = 0;
  let portfolio = await getallpositions();
  const role = appUser.role_id;
  if (role === 1) {
    userdetails = await getCustomerById(appUser.id);
    totalInvested = userdetails.balance;
  } else if (role === 2) {
    userdetails = await getTraderById(appUser.id);
    totalInvested = userdetails.allocated_limit - userdetails.balance;
    portfolio = await getpositionsbyid(appUser.id);
  }

  // Calculate Overall Portfolio Totals

  totalInvested = portfolio.reduce(
    (total, stock) => total + Number(stock.qty) * Number(stock.buy_price),
    0,
  );

  const totalProfitLoss = 10;
  const totalProfitLossPercent =
    totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  return (
    <div>
      <InnerNav />
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
                <p className="text-4xl font-bold">
                  PKR{" "}
                  {totalInvested.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
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
                <p
                  className={`text-2xl font-bold ${totalProfitLoss >= 0 ? "text-emerald-400" : "text-red-400"}`}
                >
                  {totalProfitLoss >= 0 ? "+" : ""}
                  PKR{" "}
                  {totalProfitLoss.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <span
                  className={`text-sm font-semibold ${totalProfitLoss >= 0 ? "text-emerald-400" : "text-red-400"}`}
                >
                  ({totalProfitLoss >= 0 ? "+" : ""}
                  {totalProfitLossPercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
          {role !== 1 && (
            <div className="flex align-middle justify-center gap-[1/2] font-semibold ">

              <div className="  m-3 mb-5 bg-emerald-800  w-1/3 h-16  rounded-2xl hover:bg-emerald-500 flex items-center justify-center">
                <AddStockPopup traderId={appUser.id} className="w-full h-full">
                  <button
                    type="button"
                    className="w-full h-full flex items-center justify-center text-center"
                  >
                    Add Stock
                  </button>
                </AddStockPopup>
              </div>
          

              {role === 2 && (
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
                      <tr
                        key={stock.Stockid}
                        className="hover:bg-neutral-800/50 transition-colors"
                      >
                        <td className="p-4 font-bold text-emerald-400">
                          {stock.Symbol}
                        </td>
                        <td className="p-4 text-gray-300">
                          {stock.Companyname}
                        </td>
                        <td className="p-4">{stock.Quantity}</td>
                        <td className="p-4">
                          PKR {stock.BuyingPrice.toFixed(2)}
                        </td>
                        <td className="p-4 font-semibold">
                          PKR {stock.currentPrice.toFixed(2)}
                        </td>
                        <td className="p-4">
                          PKR{" "}
                          {stock.currentValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td
                          className={`p-4 font-semibold ${stock.profitLoss >= 0 ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {stock.profitLoss >= 0 ? "+" : ""}
                          {stock.profitLoss.toFixed(2)}
                        </td>
                        <td
                          className={`p-4 font-semibold ${stock.profitLossPercent >= 0 ? "text-emerald-400" : "text-red-400"}`}
                        >
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
