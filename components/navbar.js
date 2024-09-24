import React from "react";
import { ethers } from "ethers";

export default function navbar({
  isConnected,
  address,
  connectWallet,
  openModal,
  balance,
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 px-16 bg-[#BCA37F]">
      <p>JSN</p>
      <div className="flex items-center justify-center gap-4">
        <div className="bg-[#EAD7BB] py-2 px-5 rounded-[15px] text-[#113946]">
          Balance: {ethers?.formatEther(BigInt(balance))} JSN
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
  );
}
