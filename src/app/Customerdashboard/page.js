
import React from "react";
import Link from "next/link";
import Image from "next/image";
import wallet from "@/assets/walleticon.png";
import InnerNav from "@/components/InnerNav";

const page = () => {
  return (
    <div className="min-h-screen bg-black">

      <InnerNav />

      {/* Stats */}
      <div className="w-full px-4 flex flex-wrap justify-center gap-5 py-8">

        <div className="w-full sm:w-[30%] lg:w-1/5 bg-neutral-800 p-5 rounded-2xl border border-neutral-600">
          <p className="text-neutral-400 text-[12px]">
            Portfolio Value
          </p>
          <h1 className="text-[20px] text-white font-semibold">
            PKR: 19000
          </h1>
        </div>

        <div className="w-full sm:w-[30%] lg:w-1/5 bg-neutral-800 p-5 rounded-2xl border border-neutral-600">
          <p className="text-neutral-400 text-[12px]">
            Today's Gain
          </p>
          <h1 className="text-[20px] text-white font-semibold">
            PKR: 1900
          </h1>
        </div>

        <div className="w-full sm:w-[30%] lg:w-1/5 bg-neutral-800 p-5 rounded-2xl border border-neutral-600">
          <p className="text-neutral-400 text-[12px]">
            Cash Balance
          </p>
          <h1 className="text-[20px] text-white font-semibold">
            PKR: 1900
          </h1>
        </div>

      </div>


      {/* Main Cards */}
      <div className="w-full lg:w-2/3 mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Wallet */}
        <div className="w-full min-h-[220px] p-8 sm:p-10 bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-2xl border border-transparent transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500 cursor-pointer">

          <Image
            className="rounded-xl mb-3"
            src={wallet}
            alt="Wallet"
            loading="eager"
          />

          <h1 className="text-white font-bold text-[20px]">
            My Wallet
          </h1>

          <p className="text-neutral-200">
            Manage your funds, request withdrawals, and add investment
          </p>

          <p className="text-emerald-300 mt-4">
            Open &gt;
          </p>

        </div>


        {/* Stock Portfolio */}
        <Link href="/portfolio">

          <div className="w-full min-h-[220px] p-8 sm:p-10 bg-gradient-to-r from-blue-900 to-blue-950 rounded-2xl border border-transparent transition-all duration-200 hover:-translate-y-1 hover:border-blue-500 cursor-pointer">

            <Image
              className="rounded-xl mb-3"
              src={wallet}
              alt="Stock Portfolio"
            />

            <h1 className="text-white font-bold text-[20px]">
              Stock Portfolio
            </h1>

            <p className="text-neutral-200">
              View PSX stock holdings, performance and positions
            </p>

            <p className="text-emerald-300 mt-4">
              Open &gt;
            </p>

          </div>

        </Link>

      </div>

    </div>
  );
};

export default page;