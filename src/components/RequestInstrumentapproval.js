"use client";

import { useState } from "react";

export default function RequestInstrumentapproval({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  function openPopup() {
    setIsOpen(true);
  }

  return (
    <>
      {/* Button wrapper */}
        <div
            onClick={openPopup}
            className="w-full h-full"
            >
            {children}
        </div>

      {/* Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Request Instrument Approval
              </h2>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-2xl text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            {/* Your request form goes here */}
          </div>
        </div>
      )}
    </>
  );
}