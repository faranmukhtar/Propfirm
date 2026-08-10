import React from "react";
import wallet from "@/assets/walleticon.png";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getuserbyid } from "@/lib/db/Users";
import InnerNav from "@/components/InnerNav";

const currentval = 185000;
const invested = 15000;
const growth = (((currentval - invested) / invested) * 100).toFixed(2);

const page = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cuser = await getuserbyid(user.id);
  const role = cuser.role_id;

  return (
    <div className="">
        <InnerNav user={cuser} />
        <div className="w-full px-5 sm:px-8 py-8 text-center">
            <h1 className="text-white text-3xl font-bold">
                Your Wallet
            </h1>

            <p className="text-neutral-400 mt-1">
                Manage your funds
            </p>

            <div className="p-6 mx-auto sm:w-4/5 md:w-[60%] bg-neutral-900 border border-neutral-500 mt-8 rounded-3xl">

                <div className="flex">
                <h1 className="text-white font-semibold text-xl mt-2">
                    Current value
                </h1>

                <Image
                    className="size-10 rounded-2xl ml-auto"
                    src={wallet}
                    alt="wallet icon"
                />
                </div>

                <div className="flex gap-6 items-center mt-2">
                <h1 className="text-white text-[40px] font-semibold">
                    PKR {currentval.toLocaleString()}
                </h1>

                <h1
                    className={
                    growth >= 0
                        ? "font-semibold text-[20px] text-green-500"
                        : "font-semibold text-[20px] text-red-500"
                    }
                >
                    {growth >= 0 ? "+" : ""}
                    {growth}%
                </h1>
                </div>

                <div className="flex gap-1 mt-2">
                <h1 className="text-white text-[15px] font-semibold">
                    Total invested:
                </h1>

                <h1 className="text-neutral-300 text-[15px]">
                    PKR {invested.toLocaleString()}
                </h1>
                </div>
            </div>                  
            </div>
        </div>
  );
};

export default page;