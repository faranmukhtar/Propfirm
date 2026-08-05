import React from 'react'
import Image from "next/image";
import logo from '@/assets/logo.png'
import Link from 'next/link'

const navbar = () => {
  return (
    <div className='w-screen bg-neutral-900 p-3 pl-5 flex items-center gap-3'>
      <div className='size-10 '>
        <Link href ="/">
          <Image src={logo} alt="logo"
            className = "object-contain rounded-lg "
          />
        </Link>
      </div>
      <div className='font-bold lg:flex items-center gap-1'>
        <h1 className='font-bold text-white'>
          ABC
        </h1>
        <h1 className='text-emerald-400'>
          INVESTMENTS
        </h1>
      </div>
      <div className='flex items-center gap-6 ml-auto pr-2 font-medium'>
        <Link href = "/Customerlogin" className='text-gray-400  hover:bg-gray-700 p-1.5 rounded-xl pl-3.5 pr-3.5 ' >
          Login
        </Link>
        <Link href = "/Customersignup" className='text-white bg-emerald-500 hover:bg-emerald-400 p-1.5 rounded-xl pl-3.5 pr-3.5' >
          Sign up
        </Link>
                
      </div>
    </div>
    
  )
}

export default navbar