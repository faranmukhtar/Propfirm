import React from "react";
import Link from "next/link";
import Image from "next/image";
import wallet from "@/assets/walleticon.png";
import InnerNav from "@/components/InnerNav";
import charticon from "@/assets/charticon.png";
import {getuserbyid}from "@/lib/db/Users"
import { Users , ChartNoAxesCombined , Layers } from 'lucide-react';
import { createClient } from "@/lib/supabase/server";


const page = async() => {
   const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cuser = await getuserbyid(user.id);
  const role = cuser.role_id;
  return (
    <div className="min-h-screen bg-black">
      <InnerNav user={cuser} />

      {/* Stats */}
      <div className="w-full px-4 flex flex-wrap justify-center gap-5 py-8">
        <div className="w-full sm:w-[30%] lg:w-1/5 bg-neutral-800 p-5 rounded-2xl border border-neutral-600">
          <p className="text-neutral-400 text-[12px]">Portfolio Value</p>
          <h1 className="text-[20px] text-white font-semibold">PKR: 19000</h1>
        </div>

        <div className="w-full sm:w-[30%] lg:w-1/5 bg-neutral-800 p-5 rounded-2xl border border-neutral-600">
          <p className="text-neutral-400 text-[12px]">Today's Gain</p>
          <h1 className="text-[20px] text-white font-semibold">PKR: 1900</h1>
        </div>

        <div className="w-full sm:w-[30%] lg:w-1/5 bg-neutral-800 p-5 rounded-2xl border border-neutral-600">
          <p className="text-neutral-400 text-[12px]">Cash Balance</p>
          <h1 className="text-[20px] text-white font-semibold">PKR: 1900</h1>
        </div>
      </div>

      {/* Main Cards */}
      <div className="w-full lg:w-4/5 mx-auto px-4 sm:px-15 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 ">
        {/* Wallet */}
        <Link href = "/wallet " className="group ">
          <div className="flex gap-6 w-full min-h-[220px] p-8 sm:p-10 bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-2xl border border-transparent transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500 cursor-pointer">
            <Image
              className="rounded-xl size-20 my-auto"
              src={wallet}
              alt="Wallet"
              loading="eager"
            />

            <div>
              <h1 className="text-white font-bold text-[20px]">My Wallet</h1>

              <p className="text-neutral-200">
                Manage your funds, request withdrawals, and add investment
              </p>

              <div className="flex items-center gap-2 mt-5 text-emerald-400 font-medium text-sm group-hover:gap-3 transition-all">
                <span>Manage Customers</span>
                <span>→</span>
              </div> 
            </div>
          </div>
        </Link>


        {/* Stock Portfolio */}
        <Link href="/portfolio" className="group">
          <div className="gap-6 w-full min-h-[220px] p-8 sm:p-10 bg-gradient-to-r from-blue-900 to-blue-950 rounded-2xl border border-transparent transition-all duration-200 hover:-translate-y-1 hover:border-blue-500 cursor-pointer flex items-center">
            <div className="bg-blue-950 p-4 rounded-2xl">
              <ChartNoAxesCombined size={50} color="#0b51ad" />
            </div>
            <div>
              <h1 className="text-white font-bold text-[20px]">
                Stock Portfolio
              </h1>

              <p className="text-neutral-200">
                View PSX stock holdings, performance and positions
              </p>

              <div className="flex items-center gap-2 mt-5 text-[#2a99f4] font-medium text-sm">
                <span>Your Portfolio</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>

          </div>
        </Link>
     
      {role === 3 &&(
      <Link href="/customers" className="group">
          <div className="gap-6 w-full min-h-[220px] p-8 sm:p-10 bg-gradient-to-r from-amber-600 to-yellow-950 rounded-2xl border border-transparent transition-all duration-200 hover:-translate-y-1 hover:border-amber-500 cursor-pointer flex items-center">
            <div className="p-4 rounded-xl bg-amber-700 flex items-center justify-center mb-4">
              <Users
              size={50}
              className="text-[#ffcb0f]"
              strokeWidth={2}
            />
            </div>
            <div>
              <h1 className="text-white font-bold text-[20px]">
                 Customers
              </h1>

              <p className="text-neutral-200">
                  View and manage customer accounts, investments, and activity.
              </p>

               <div className="flex items-center gap-2 mt-5 text-[#ffcb0f] font-medium text-sm group-hover:gap-3 transition-all">
                <span>Manage Customers</span>
                <span>→</span>
              </div>
            </div>

          </div>
        </Link>
      )}
      {role === 3 &&(
        <Link href="/instruments" className="group">
          <div className="gap-6 w-full min-h-[220px] p-8 sm:p-10 bg-gradient-to-r from-violet-800 to-purple-950 rounded-2xl border border-transparent transition-all duration-200 hover:-translate-y-1 hover:border-violet-400 cursor-pointer flex items-center">

            <div className="p-4 rounded-xl bg-purple-950 flex items-center justify-center">
              <Layers
                size={50}
                className="text-[#a78bfa]"
                strokeWidth={2}
              />
            </div>

            <div>
              <h1 className="text-white font-bold text-[20px]">
                Instruments
              </h1>

              <p className="text-neutral-200">
                Add / Remove acceptable instruments.
              </p>

              <div className="flex items-center gap-2 mt-5 text-[#a78bfa] font-medium text-sm">
                <span>Manage Instruments</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>

          </div>
        </Link>

      )}
    </div>
  </div>
  );
};

export default page;
