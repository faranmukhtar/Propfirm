import React from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import walleticon from '@/assets/walleticon.png'
import psxicon from '@/assets/charticon.png'
import secpicon from '@/assets/secpicon.png'
import portfolioicon from '@/assets/portfoliogrowicon.png'
import Image from 'next/image'
import { getTotalInvestedCapital , gettopstocks } from '@/lib/db/Positions'


async function getmovementpercentage(num){
  return num
}


const renderStockBadge = async(symbol , num) => {
    if (!symbol) return <span className="text-gray-400">N/A</span>;

    const move = await getmovementpercentage(num)
    console.log(move) 
    const isPositive = move >= 0;
    return (
      <div className="flex items-center gap-2">
        <div>
          <h1 className="font-bold text-white">{symbol}</h1>
          <h1 className={`text-xs font-semibold px-2 rounded ${
            isPositive ? 'text-emerald-400' : ' text-red-400'
          }`}>
            {isPositive ? '+' : ''}{move}%
          </h1>
        </div>
      </div>
    );
  };


const page = async () => {
  const total = await getTotalInvestedCapital(1);
  const top = await gettopstocks()
  const top1 = getmovementpercentage(+4)

  return (
    <div className='bg-black min-h-screen overflow-x-hidden'>
      <Navbar />
      <div className='flex'>
        <div className='p-10 lg:p-20 lg:w-1/2 pt-15 '>
          <div className="font-extrabold text-[30px] lg:text-[50px] text-white">
              <h1>
                Invest Smarter,{" "}
                <span className="text-emerald-500">
                  Grow
                  <br className="hidden lg:block" />
                  Faster
                </span>
              </h1>
            </div>
            <div className='pt-10'>
              <h1 className='text-gray-500 text-[20px]'>
                ABC Investments gives you professional-grade tools to build,
                manage, and grow your equity portfolio — all in one seamless 
                platform designed for the modern investor.
              </h1>
            </div>
            <div className='pt-[3vh] text-[20px] font-semibold'>
              <Link href = "customersignup" className='text-white bg-emerald-500 hover:bg-emerald-400 p-4.5 rounded-xl pl-6.5 pr-6.5' >
                Start Investing → 
              </Link>
          </div>
        </div>

        <div className="hidden lg:flex w-1/2 justify-center items-center">
        <div className="relative w-[550px] h-[550px]">

          {/* Outer Circle */}
          <div className="absolute left-1/2 top-1/2 w-[460px] h-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-800"></div>

          {/* Inner Circle */}
          <div className="absolute left-1/2 top-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-800"></div>

          {/* Main Card */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[330px] bg-neutral-800 rounded-2xl flex items-center justify-center">
              <div >
                <Image className="rounded-3xl ml-9 mb-3 size-20" src={portfolioicon} alt="portfoliogrowicon"></Image>
                <h1 className='text-neutral-400 font-semibold'>Total Portfolio value: </h1>
                <h1 className='text-[32px] font-bold'>PKR {total}</h1>

              </div>
          </div>

          {/* Top Left */}
          <div className="absolute top-15 left-3 bg-neutral-700 border border-neutral-600 rounded-xl px-5 py-1 text-white shadow-lg">
            <h1>{ renderStockBadge(top[0] , -2)}</h1>
          </div>

          {/* Top Right */}
          <div className="absolute top-17 right-5 bg-neutral-700 border border-neutral-600 rounded-xl px-5 py-1 text-white shadow-lg">
            <h1>{ renderStockBadge(top[1] , +23)}</h1>
          </div>

          {/* Bottom Left */}
          <div className="absolute bottom-20 left-3 bg-neutral-700 border border-neutral-600 rounded-xl px-5 py-1 text-white shadow-lg">
            <h1>{ renderStockBadge(top[2] , 10)}</h1>
          </div>

          {/* Bottom Right */}
          <div className="absolute bottom-13 right-2 bg-neutral-700 border border-neutral-600 rounded-xl px-5 py-1 text-white shadow-lg">
            <h1>{ renderStockBadge(top[3] , 20)}</h1>
          </div>

        </div>
      </div>

      </div>
      <div className='bg-neutral-900 w-full lg:h-28 lg:flex gap-[5vw] justify-center p-3'>
        <div className='lg:w-1/4 h-full rounded-2xl p-4 text-amber-50 flex '>
            <Image className= "size-11 mr-3 rounded-xl" src ={secpicon} alt =""></Image>
            <div>
              <h1 className='font-semibold text-white'>SECP Regulated</h1>
              <h1 className='text-gray-400'>Fully compliant with all laws</h1>
            </div>
        </div>
        <div className='lg:w-1/4 h-full rounded-2xl p-4 text-amber-50 flex '>
            <Image className= "size-11 mr-3 rounded-xl" src ={psxicon} alt =""></Image>
            <div>
              <h1 className='font-semibold text-white'>Real-time PSX Data</h1>
              <h1 className='text-gray-400'>Live market data from Pakistan Stock Exchange.</h1>
            </div>
        </div>
        <div className='lg:w-1/4 h-full rounded-2xl p-4 text-amber-50 flex '>
            <Image className= "size-11 mr-3 rounded-xl" src ={walleticon} alt =""></Image>
            <div>
              <h1 className='font-semibold text-white'>Instant Withdrawals</h1>
              <h1 className='text-gray-400'>Funds transferred to your bank within 24 hours.</h1>
            </div>
        </div>
      </div>

    </div>
  )
}

export default page