"use client";

import React, { useState } from "react";
import { approveinstrument } from "@/lib/db/Instruments";
import { useRouter } from "next/navigation";

const ApproveInstrument = ({ id, company, symbol }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleApprove = async () => {
    setLoading(true);
    setError("");

    try {
      await approveinstrument(id);

      setOpen(false);

      // Refresh the server component
      router.refresh();
    } catch (error) {
      console.error("Error approving instrument:", error);
      setError(error.message || "Failed to approve instrument.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Approve button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 rounded-lg text-sm font-medium
        text-emerald-400 bg-emerald-400/10
        hover:bg-emerald-400/20 transition-colors"
      >
        Approve
      </button>

      {/* Popup */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-6 text-left">

            <h2 className="text-white text-xl font-bold">
              Approve Stock
            </h2>

            <p className="text-neutral-400 mt-3 leading-relaxed">
              Approve{" "}
              <span className="text-white font-semibold">
                {company} ({symbol})
              </span>
              ?
            </p>

            <p className="text-neutral-500 text-sm mt-3">
              Approving this stock will allow traders to use the
              firm's capital to trade it.
            </p>

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                <p className="text-sm text-red-400">
                  {error}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm
                text-neutral-300 bg-neutral-800
                hover:bg-neutral-700 transition-colors
                disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApprove}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium
                text-black bg-emerald-400
                hover:bg-emerald-300 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Approving..." : "Approve Stock"}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default ApproveInstrument;