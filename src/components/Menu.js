
"use client";
import { logout } from "@/actions/logout";
import React, { useState } from "react";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut } from 'lucide-react';

export default function Menu({ isOpen, onClose, user }) {
    const [showTraderRequest, setShowTraderRequest] = useState(false);
    const pathname = usePathname();
    const initials =
        `${user?.fname?.[0] || ""}${user?.lname?.[0] || ""}`.toUpperCase();

    if (!isOpen) return null;

  return (
    <>
      {/* MENU */}
    <div className="fixed inset-0 z-40 flex w-full flex-col bg-neutral-950 p-6 sm:w-1/2 md:w-1/2 lg:w-1/4">
        {/* Logo */}
        <div className="flex items-center gap-1 font-bold">
          <div className="size-7">
            <Image
              src={logo}
              alt="logo"
              className="rounded-lg object-contain"
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

        <hr className="mt-5 -mx-6 w-auto border-0 border-t border-neutral-700" />
        {/* User */}
        <div className="mt-8 flex items-center gap-3">
          {/* Initials */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
            {initials}
          </div>

          {/* User Details */}
          <div className="min-w-0">
            <h1 className="truncate text-2xl text-white">
              {user?.fname} {user?.lname}
            </h1>

            <p className="truncate text-[15px] text-neutral-400">
              {user?.email}
            </p>
          </div>
        {user?.role_id === 2 && (
            <div
                
                className="mt-2 ml-auto w-1/4 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-center font-semibold text-amber-300 transition-all duration-200 "
            >
                Trader
            </div>
        )}
        
        {user?.role_id === 3 && (
            <div
                
                className="mt-2 ml-auto w-1/4 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-center font-semibold text-amber-300 transition-all duration-200 "
            >
                Owner
            </div>
        )}
        </div>

        <hr className="mt-7 -mx-6 w-auto border-0 border-t border-neutral-700" />
        {/* Become Trader */}
        {user?.role_id === 1 && (
            <button
                type="button"
                onClick={() => setShowTraderRequest(true)}
                className="mt-6 w-full rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-center font-semibold text-amber-300 transition-all duration-200 hover:border-amber-400/50 hover:bg-amber-500/20"
            >
                Request to Become a Trader
            </button>
        )}

        

        {/* Dashboard */}
     <div className="mt-5 w-full">
        <Link
            href="/customerdashboard"
            className={`block w-full border-b-2 px-3 py-3 text-left font-semibold transition-colors ${
            pathname === "/customerdashboard"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-white hover:border-emerald-400 hover:text-emerald-400"
            }`}
        >
            Dashboard
        </Link>
    </div>      

    <div className="mt-5 w-full">
        <Link
            href="/portfolio"
            className={`block w-full border-b-2 px-3 py-3 text-left font-semibold transition-colors ${
            pathname === "/portfolio"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-white hover:border-emerald-400 hover:text-emerald-400"
            }`}
        >
            Portfolio
        </Link>
    </div>   

    <div className="mt-5 w-full">
        <Link
            href="/wallet"
            className={`block w-full border-b-2 px-3 py-3 text-left font-semibold transition-colors ${
            pathname === "/wallet"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-white hover:border-emerald-400 hover:text-emerald-400"
            }`}
        >
            Wallet
        </Link>
    </div>  

    <div className="mt-5 w-full">
        <Link
            href="/settings"
            className={`block w-full border-b-2 px-3 py-3 text-left font-semibold transition-colors ${
            pathname === "/settings"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-white hover:border-emerald-400 hover:text-emerald-400"
            }`}
        >
            Settings
        </Link>
    </div>  

    {(user.role_id === 3 || user.role_id === 4) && (
     <div className="mt-5 w-full">
        <Link
            href="/instruments"
            className={`block w-full border-b-2 px-3 py-3 text-left font-semibold transition-colors ${
            pathname === "/instruments"
                ? "border-yellow-400 text-yellow-400"
                : "border-transparent text-white hover:border-yellow-400 hover:text-yellow-400"
            }`}
        >
            Instruments
        </Link>
    </div>
    )}

    {(user.role_id === 3 || user.role_id === 4) && (
    <div className="mt-5 w-full">
        <Link
            href="/users"
            className={`block w-full border-b-2 px-3 py-3 text-left font-semibold transition-colors ${
            pathname === "/users"
                ? "border-yellow-400 text-yellow-400"
                : "border-transparent text-white hover:border-yellow-400 hover:text-yellow-400"
            }`}
        >
            Users
        </Link>
    </div>
    )}
    

  {/* Your logo, user info, dashboard, etc. */}
    
    <div className="mt-auto w-full">
        <hr className="mb-2 -mx-6 border-0 border-t border-neutral-700" />

        <form action={logout}>
            <button
            type="submit"
            className="flex w-full gap-2 border-b-2 border-transparent px-3 py-3 text-left font-semibold text-red-600 transition-colors hover:border-red-500 hover:text-red-500"
            >
            <LogOut color="#f20202" />
            Logout
            </button>
        </form>
    </div>

    </div>

      {/* TRADER REQUEST POPUP */}
      {showTraderRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
            {/* Popup Header */}
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

            {/* Description */}
            <p className="mt-3 text-gray-400">
              Submit a request to become a trader. An administrator will
              review your request.
            </p>

            {/* Popup Buttons */}
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

