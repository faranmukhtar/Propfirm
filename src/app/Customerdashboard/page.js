import React from 'react'
import Link from 'next/link'
import InnerNav from '@/components/InnerNav'



const page = () => {
  return (
    <div>
        <InnerNav />
        <Link className='w-10 h-10 bg-blue-500' href ="/Portfolio"> Portfolio </Link>
    </div>
  )
}

export default page
