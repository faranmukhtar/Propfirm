
"use client";

import { useState } from "react";
import { addinstrument } from "@/lib/db/Instruments";

export default function RequestInstrumentapproval({
  children,
  owner = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await addinstrument(
        companyName.trim(),
        symbol.trim(),
        owner // true for owner, false for trader
      );

      setCompanyName("");
      setSymbol("");
      setIsOpen(false);

      // Refresh the page so the new instrument appears immediately
      window.location.reload();
    } catch (error) {
      console.error("Error adding instrument:", error);
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-left">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {owner ? "Add Instrument" : "Request Instrument Approval"}
              </h2>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-2xl text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Company Name
                </label>

                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Systems Limited"
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Stock Symbol
                </label>

                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g. SYS"
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white uppercase outline-none focus:border-emerald-400"
                />
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg bg-neutral-800 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Adding..."
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

