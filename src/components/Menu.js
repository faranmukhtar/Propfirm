"use client"
import React from 'react'
import logo from "@/assets/logo.png";
import Image from "next/image";
import { useState } from 'react'

export default function Menu({isOpen , onClose , children}){
    if(!isOpen) return null;
    return(
        <div className='absolute top-0 left-0 z-50 flex items-center justify-center'>
            <div className = "relative w-[300px] rounded-2xl bg-neutral-900 p-4 pt-5 m-3 shadow-xl border border-neutral-700">
                <button onClick={onClose}
                    className='absolute top-4 right-4 text-gray-400 hover:text-white text-xl'>
                    X
                </button>
        
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
                <hr className="w-full bg-neutral-700 h-0.5 mt-5 "/>
                <div className='mt-5'>
                    <h1 className='text-neutral-400'>USER NAME id photo</h1>
                </div>
            </div>
        </div>
    );
}