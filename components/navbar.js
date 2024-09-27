import React from "react";
import Logo from "../public/Logo.png";
import Image from "next/image";

export default function navbar({
  isConnected,
  address,
  connectWallet,
  openModal,
  balance,
}) {
  return (
    <div className="bg-[#bca37f]">
      <div className="flex items-center justify-between gap-4 py-4 px-6 sm:px-16 w-[90vw] lg:w-[70vw] mx-auto">
        <Image src={Logo} alt="logo" className="w-[70px] animateSpin2" />
        <div className="flex items-center justify-center gap-4 flex-col-reverse md:flex-row">
          <div className="bg-[#EAD7BB] py-2 px-5 rounded-[15px] text-[#113946] max-w-[200px]">
            Balance: {balance} JSN
          </div>
          <div className="bg-[#EAD7BB] py-2 px-5 rounded-[15px] text-[#113946]">
            {isConnected ? (
              <button onClick={openModal}>
                {address.substring(0, 5)}...{address.substr(-5)}
              </button>
            ) : (
              <button onClick={connectWallet}>Connect Wallet</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
