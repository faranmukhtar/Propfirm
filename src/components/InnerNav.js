"use client"
import React, { useState } from "react";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Link from "next/link";
import {Menu } from "lucide-react";
import Popup from "@/components/Menu";

const InnerNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-neutral-900 p-3 pl-5 flex items-center gap-3">
      <button className="hover:bg-gray-700 rounded-xl h-10 w-10 p-2" onClick={() => setOpen(true) }>
        <Menu size={24} color="gray" />
      </button>

      <Popup isOpen={open} onClose={() => setOpen(false)}>
        <h1 className="text-2xl font-bold text-white">Sign In</h1>
        <p className="text-gray-400 mt-2">
          
        </p>
      </Popup>

      <Link href="customerdashboard" className="flex items-center gap-3">
        <div className="size-10">
          <Image
            src={logo}
            alt="logo"
            className="object-contain rounded-lg"
          />
        </div>

        <div className="font-bold md:flex items-center gap-1">
          <h1 className="text-white">ABC</h1>
          <h1 className="text-emerald-400">INVESTMENTS</h1>
        </div>
      </Link>
      
    </div>
  );
};

export default InnerNav;