"use client";

import { useState } from "react";
import { addinstrument } from "@/lib/db/Instruments";

export default function RequestInstrumentapproval({ children, owner = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function openPopup() {
    setError("");
    setIsOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!company.trim() || !symbol.trim()) {
      setError("Please enter both company name and stock symbol.");
      return;
    }

    try {
      setLoading(true);

      // Owner = approved immediately
      // Trader = requires approval
      await addinstrument(
        company.trim(),
        symbol.trim().toUpperCase(),
        owner
      );

      setCompany("");
      setSymbol("");
      setIsOpen(false);

    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div onClick={openPopup}>
        {children}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6">

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {owner ? "Add Instrument" : "Request Instrument"}
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  {owner
                    ? "Add a new approved stock."
                    : "Request approval for a new stock."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-2xl text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* Company */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Company Name
                </label>

                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Lucky Cement"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-white outline-none placeholder:text-neutral-500 focus:border-yellow-400"
                />
              </div>

              {/* Symbol */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Stock Symbol
                </label>

                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g. LUCK"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-3 text-white uppercase outline-none placeholder:text-neutral-500 focus:border-yellow-400"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="mb-4 text-sm text-red-400">
                  {error}
                </p>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? owner
                      ? "Adding..."
                      : "Requesting..."
                    : owner
                    ? "Add Instrument"
                    : "Request Approval"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}

