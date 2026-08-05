"use client";

import Navbar from '@/components/Navbar';
import portfolioicon from '@/assets/portfoliogrowicon.png'
import Link from 'next/link'
import Image from 'next/image';
import {handlelogin} from'./actions';
import { useActionState } from "react";


export default function RegisterPage() {

  const [state , formAction] = useActionState(handlelogin,{
    error : ""
  });

  return (
    <div>
      <Navbar />
        <div className='flex-col align-middle text-center justify-center mt-6 sm:mt-10 px-4'>
              
            <Image className="size-15 rounded-2xl mx-auto" src={portfolioicon} alt=""></Image>
            <h1 className='text-[22px] sm:text-[26px] md:text-[30px] font-semibold'>Welcome Back</h1>
            <h1 className='text-sm sm:text-base'>Log in to your ABC Investments account</h1>
            
        </div>
      <div className="px-4">
      <div className="w-full max-w-md mx-auto mt-6 sm:mt-10 p-4 sm:p-6 bg-neutral-800 border border-neutral-700 rounded-lg shadow-sm text-black">
        <div className='p-2 bg-neutral-700 w-full h-14 sm:h-15 rounded-xl mb-5 flex gap-2 sm:gap-10 align-middle justify-center items-center'>
          <div className="flex-1 text-center bg-emerald-500 py-3 px-4 rounded-xl text-white font-semibold text-sm sm:text-base">
          Login
          </div>
          
          <Link href="/Customersignup" className='flex-1 text-center py-3 px-4 text-neutral-400 font-semibold hover:text-white text-sm sm:text-base'>
            Sign up
        </Link>
        </div>
        <form action={formAction} className="space-y-4">
          {/* Full Name field */}
          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-400">
              Registered Email
            </label>
            <input
              name="Email"
              type="text"
              placeholder="e.g. Ali@gmail.com"
              required
              className="w-full p-2 border border-neutral-500 rounded-xl  bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-300 placeholder:text-gray-500"

            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-400 ">
              Password
            </label>
            <input
              name="Password"
              type="password"
              required
              minLength={7}
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!])[A-Za-z\d@#!]{7,}$"
              title="Password must be at least 7 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@, #, or !)."
              
              className="w-full p-2 border border-neutral-500 bg-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-300 placeholder:text-gray-500"
            />
          </div>

          {state.error && (
            <p className="text-red-400 text-sm text-center">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-500  text-white py-2 rounded-xl font-medium hover:bg-emerald-400 mt-2 transition-colors"
          >            
            Login
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}