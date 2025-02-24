import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'

const Navbar = () => {
  return (
    <div>
          <header className="bg-gray-900 p-4  border-b-[5px] border-red-700 flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <div className="font-bold  bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent text-sm sm:text-3xl">
          Counter
        </div>
        {/* <button className="px-3 py-2 sm:px-4 sm:py-2 text-base rounded-full bg-blue-900 hover:bg-red-700 ">
          Connect Wallet
        </button> */}

        < ConnectButton  
        accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
          
          showBalance={{
            smallScreen: false,
            largeScreen: true,
          }}/>



          
      </header>
    </div>
  )
}

export default Navbar