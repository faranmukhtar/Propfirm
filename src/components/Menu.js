"use client";

import React, { useState } from "react";
import logo from "@/assets/logo.png";
import Image from "next/image";


export default function Menu({ isOpen, onClose, children }) {
  const [showTraderRequest, setShowTraderRequest] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* MENU */}
      <div className="fixed inset-0 z-40 w-full bg-neutral-950 p-6 sm:w-1/2 md:w-1/2 lg:w-1/4">

        {/* Logo */}
        <div className="font-bold flex items-center gap-1">
          <div className="size-7">
            <Image
              src={logo}
              alt="logo"
              className="object-contain rounded-lg"
            />
          </div>

          <h1 className="text-white">ABC</h1>
          <h1 className="text-emerald-400">INVESTMENTS</h1>
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-2xl text-gray-400 hover:text-white"
        >
          ×
        </button>

        <hr className="mt-5 h-0.5 w-full bg-neutral-700" />

        {/* User */}
        <div className="mt-5">
          <h1 className="text-neutral-400">
            USER NAME id photo
          </h1>
        </div>

    

        {/* Become Trader */}
       <button
            type="button"
            onClick={() => setShowTraderRequest(true)}
            className="mt-5 w-full rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-center font-semibold text-amber-300 transition-all duration-200 hover:border-amber-400/50 hover:bg-amber-500/20"
            >
            Request to Become a Trader
        </button>
      </div>

      {/* TRADER REQUEST POPUP */}
      {showTraderRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6">

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Become a Trader
              </h2>

              <button
                type="button"
                onClick={() => setShowTraderRequest(false)}
                className="text-2xl text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <p className="mt-3 text-gray-400">
              Submit a request to become a trader. An administrator will
              review your request.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowTraderRequest(false)}
                className="rounded-lg border border-neutral-700 px-4 py-2 text-gray-300 hover:bg-neutral-800"
              >
                Cancel
              </button>

              <button
                type="button"
                className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-black hover:bg-emerald-400"
              >
                Submit Request
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}