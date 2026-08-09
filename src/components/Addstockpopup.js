"use client";

import { useState } from "react";
import { addPosition } from "@/lib/db/Positions";
import { getallinstruments } from "@/lib/db/Instruments";

export default function AddStockPopup({ traderId, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const [instruments, setInstruments] = useState([]);
  const [instrumentId, setInstrumentId] = useState("");
  const [qty, setQty] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingInstruments, setLoadingInstruments] = useState(false);
  const [error, setError] = useState("");

  async function openPopup() {
    setIsOpen(true);
    setError("");

    // Only fetch instruments the first time
    if (instruments.length === 0) {
      try {
        setLoadingInstruments(true);

        const data = await getallinstruments();

        setInstruments(data || []);
      } catch (error) {
        console.error("Error fetching instruments:", error);
        setError("Failed to load instruments.");
      } finally {
        setLoadingInstruments(false);
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await addPosition(
        traderId,
        Number(instrumentId),
        Number(qty),
        Number(buyPrice),
      );

      setInstrumentId("");
      setQty("");
      setBuyPrice("");

      setIsOpen(false);
    } catch (error) {
      console.error(error);
      setError("Failed to add position.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* BUTTON YOU STYLE FROM PORTFOLIO PAGE */}
      <div
        onClick={openPopup}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openPopup();
        }}
        className="cursor-pointer w-full h-full"
      >
        {children}
      </div>

      {/* POPUP */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Add Stock</h2>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-2xl text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* INSTRUMENT DROPDOWN */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Instrument
                </label>

                <select
                  value={instrumentId}
                  onChange={(e) => setInstrumentId(e.target.value)}
                  required
                  disabled={loadingInstruments}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-white"
                >
                  <option value="">
                    {loadingInstruments
                      ? "Loading instruments..."
                      : "Select an instrument"}
                  </option>

                  {instruments.map((instrument) => (
                    <option key={instrument.id} value={instrument.id}>
                      {instrument.symbol} - {instrument.company_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* QUANTITY */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-white"
                />
              </div>

              {/* BUY PRICE */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Buy Price
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 p-3 text-white"
                />
              </div>

              {/* ERROR */}
              {error && <p className="text-sm text-red-400">{error}</p>}

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-neutral-700 px-5 py-3 text-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || loadingInstruments}
                  className="rounded-lg bg-emerald-500 px-5 py-3 font-semibold text-black disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
