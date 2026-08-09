"use client";

import { handleRegister } from "./actions";

import Navbar from "@/components/Navbar";
import portfolioicon from "@/assets/portfoliogrowicon.png";
import Link from "next/link";
import { Link2 } from "lucide-react";
import Image from "next/image";
import { useState, useActionState } from "react";

const initialState = { error: null };

export default function RegisterPage() {
  const [cnic, setcnic] = useState("");
  const [password, setpassword] = useState("");
  const [passworderror, setpassworderror] = useState("");
  const [state, formAction, pending] = useActionState(
    handleRegister,
    initialState,
  );

  function formatcnic(value) {
    value = value.replace(/\D/g, "").slice(0, 13);

    if (value.length > 5) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    }

    if (value.length > 13) {
      value = value.slice(0, 13) + "-" + value.slice(13);
    }
    return value;
  }

  function checkpassword(value) {
    if (value !== password) {
      setpassworderror("Passwords do not match");
    } else {
      setpassworderror("");
    }
  }

  function handleSubmit(e) {
    const confirmValue = e.target.elements["ConfirmPassword"].value;
    if (password !== confirmValue) {
      e.preventDefault();
      setpassworderror("Passwords do not match");
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex-col align-middle text-center justify-center mt-6 sm:mt-10 px-4">
        <Image
          className="size-15 rounded-2xl mx-auto"
          src={portfolioicon}
          alt=""
        ></Image>
        <h1 className="text-[22px] sm:text-[26px] md:text-[30px] font-semibold">
          Welcome
        </h1>
        <h1 className="text-sm sm:text-base">
          Sign up for your ABC Investments account
        </h1>
      </div>
      <div className="px-4">
        <div className="w-full max-w-md mx-auto mt-6 sm:mt-10 p-4 sm:p-6 bg-neutral-800 border border-neutral-700 rounded-lg shadow-sm text-black">
          <div className="p-2 bg-neutral-700 w-full h-14 sm:h-15 rounded-xl mb-5 flex gap-2 sm:gap-10 align-middle justify-center items-center">
            <Link
              href="/customerlogin"
              className="flex-1 text-center py-3 px-4 text-neutral-400 font-semibold hover:text-white text-sm sm:text-base"
            >
              Login
            </Link>
            <div className="bg-emerald-500 flex-1 text-center py-3 px-4 rounded-xl text-white font-semibold text-sm sm:text-base">
              Sign up
            </div>
          </div>
          <form
            action={formAction}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Full Name field */}
            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-400">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                placeholder="e.g. Ali Ahmed"
                required
                className="w-full p-2 border border-neutral-500 rounded-xl  bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-300 placeholder:text-gray-500"
              />
            </div>

            {/* CNIC field */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400 ">
                CNIC
              </label>
              <input
                name="Cnic"
                type="text"
                value={cnic}
                onChange={(e) => setcnic(formatcnic(e.target.value))}
                placeholder="e.g. 12345-1234567-1"
                pattern="[0-9]{5}-[0-9]{7}-[0-9]{1}"
                title="Format must be XXXXX-XXXXXXX-X"
                required
                className="w-full p-2 border border-neutral-500 bg-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-300 placeholder:text-gray-500 font-medium"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400 ">
                Phone Number
              </label>
              <input
                name="Phonenumber"
                type="tel"
                placeholder="e.g.03001234567"
                required
                className="w-full p-2 border border-neutral-500 bg-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-300 placeholder:text-gray-500"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">
                Email
              </label>
              <input
                name="Email"
                type="email"
                placeholder="e.g.ali@example.com"
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
                onChange={(e) => setpassword(e.target.value)}
                required
                placeholder="eg. PassX@sh-e12"
                minLength={7}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!])[A-Za-z\d@#!]{7,}$"
                title="Password must be at least 7 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@, #, or !)."

                className="w-full p-2 border border-neutral-500 bg-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-300 placeholder:text-gray-500"
              />
            </div>

            {/* re-enter Password */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400 ">
                Confirm Password
              </label>
              <input
                name="ConfirmPassword"
                type="password"
                onChange={(e) => checkpassword(e.target.value)}
                required
                placeholder="eg. PassX@sh-e12"
                minLength={7}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!])[A-Za-z\d@#!]{7,}$"
                title="Password must be at least 7 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@, #, or !)."

                className="w-full p-2 border border-neutral-500 bg-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-300 placeholder:text-gray-500"
              />
            </div>

            {(passworderror || state?.error) && (
              <p className="text-red-400 text-sm text-center">
                {passworderror || state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-emerald-500  text-white py-2 rounded-xl font-medium hover:bg-emerald-400 mt-2 transition-colors disabled:opacity-60"
            >
              {pending ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
