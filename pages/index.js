import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import Web3Modal from "web3modal"; // Import Web3Modal
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import Navbar from "../components/navbar";
import Logo from "../public/Logo.png";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const projectId = "d4e79a3bc1f5545a422926acb6bb88b8";

const sepolia = {
  chainId: 11155111, // Chain ID for Sepolia testnet
  name: "Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io",
  rpcUrl: "https://sepolia.infura.io/v3/7501310bfbe94f0fb0f9bf0c190a0a64",
};

// const mainnet = {
//   chainId: 1,
//   name: "Ethereum",
//   currency: "ETH",
//   explorerUrl: "https://etherscan.io",
//   rpcUrl: "https://mainnet.infura.io/v3/7501310bfbe94f0fb0f9bf0c190a0a64",
// };

const metadata = {
  name: "Tweet App",
  description: "tweet app",
  url: "https://x.com",
  icons: ["https://x.com"],
};

const web3Modal = createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [sepolia],
  projectId,
  enableAnalytics: true,
});

function useEthereumWallet() {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const ethersProvider = isConnected
    ? new ethers.BrowserProvider(walletProvider)
    : null;
  const signer = isConnected ? ethersProvider.getSigner() : null;

  return { address, chainId, isConnected, ethersProvider, signer };
}

export default function Index() {
  const { address, chainId, isConnected, ethersProvider, signer } =
    useEthereumWallet();
  const { contractAddress, contractAbi } = useSelector((state) => state.data);

  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState();
  const [holderArray, setHolderArray] = useState([]);
  const [account, setAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [userId, setUserId] = useState("");
  const [noOfToken, setNoOfToken] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenStandard, setTokenStandard] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenOwner, setTokenOwner] = useState("");
  const [tokenOwnerBalance, setTokenOwnerBalance] = useState("");
  const [inputAddress, setInputAddrss] = useState("");
  const [inputValue, setInputValue] = useState(0);

  const connectEthereumWallet = async () => {
    try {
      const instance = await web3Modal.open();
      if (instance) {
        const provider = new ethers.BrowserProvider(instance);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        toast.success("Wallet Connect Successfull", {
          theme: "dark",
        });
      } else {
        throw new Error("No provider returned from Web3Modal.");
      }
    } catch (err) {
      console.error("Ethereum wallet connection failed:", err);
    }
  };

  // const getTransaction = async () => {
  //   console.log("Getting Contract");
  //   if (contract) {
  //     console.log("There is contract");
  //     try {
  //       console.log("Start getting contract");
  //       const transactions = await contract.getTransactions();
  //       const formattedTransactions = transactions.map((tx) => ({
  //         from: tx.from,
  //         to: tx.to,
  //         amount: tx.amount.toString(), // Convert BigNumber to string (or .toNumber() if small)
  //         message: tx.message,
  //       }));

  //       console.log("set Transaction");
  //       setTransactions(formattedTransactions);
  //       console.log("set Transaction done");
  //     } catch (error) {
  //       console.error("Error Get Transaction: ", error);
  //     }
  //   }
  // };

  const getHolderData = async () => {
    if (contract) {
      try {
        const allTokenHolder = await contract.getTokenHolder();
        let tempHolderArray = []; // Temporary array to store data

        await Promise.all(
          allTokenHolder.map(async (item) => {
            const singleHolderData = await contract.getTokenHolderData(item);
            const formattedData = {
              _tokenId: singleHolderData[0],
              _to: singleHolderData[1],
              _from: singleHolderData[2],
              _totalToken: singleHolderData[3],
              _tokenHolder: singleHolderData[4],
            };
            tempHolderArray.push(formattedData);
          })
        );

        setHolderArray(tempHolderArray); // Set state once after loop
      } catch (error) {
        console.error("Error Get Transaction Count: ", error);
      }
    }
  };

  const transferToken = async () => {
    if (contract) {
      try {
        const transfer = await contract.transfer(
          inputAddress,
          BigInt(+inputValue)
        );
        contract.on("Transfer", (from, to, value) => {
          toast.success(`Transfer Token to ${to} for ${value} JSN Success`);
          getHolderData();
        });
      } catch (error) {
        console.error("Error Transfer Token: ", error);
      }
    }
  };

  const connectContract = async () => {
    try {
      if (isConnected && contract) {
        getHolderData();
        console.log("Address: " + address);
        const allTokenHolder = await contract.balanceOf(address);
        setAccountBalance(Number(allTokenHolder));
        console.log("account balance: " + Number(allTokenHolder));

        const totalHolder = await contract._userId();
        setUserId(Number(totalHolder));
        console.log("user id: " + Number(totalHolder));

        const supply = await contract.totalSupply();
        const totalSupply = Number(supply);
        setNoOfToken(totalSupply);
        console.log("Number of Token supply: " + totalSupply);

        const name = await contract.name();
        setTokenName(name);
        console.log("Name: " + name);

        const symbol = await contract.symbol();
        setTokenSymbol(symbol);
        console.log("Symbol: " + symbol);

        const standard = await contract.standard();
        setTokenStandard(standard);
        console.log("Standard: " + standard);

        const ownerOfContract = await contract.ownerOfContract();
        setTokenOwner(ownerOfContract);
        console.log("Owner of contract: " + ownerOfContract);

        const balanceToken = await contract.balanceOf(ownerOfContract);
        setTokenOwnerBalance(balanceToken);
        console.log("Owner tokan balance: " + balanceToken);
      }
      if (isConnected && !contract) {
        const signer = ethersProvider?.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          await signer
        );
        setContract(contract);
      }
    } catch (error) {
      toast.error("Please Change to Sepolia Network");
    }
  };

  useEffect(() => {
    if (isConnected) {
      connectContract();
    }
  }, [contract, isConnected]);

  const openModal = async () => {
    await web3Modal.open();
  };

  return (
    <div>
      <ToastContainer />
      <Navbar
        isConnected={isConnected}
        address={address}
        connectWallet={connectEthereumWallet}
        openModal={openModal}
        balance={accountBalance}
      />
      <section className="py-10 px-6 sm:px-16 w-[90vw] lg:w-[70vw] mx-auto grid gap-8 grid1">
        <div className="text-[#113946] flex flex-col items-start justify-center gap-4">
          <h2 className="text-3xl lg:text-4xl font-bold md:text-start text-center">
            Powering the Future of Decentralized Finance
          </h2>
          <p className="text-md lg:text-lg text-justify">
            JSN is an ERC-20 token designed to revolutionize decentralized
            finance, providing secure, efficient, and transparent transactions
            on the Ethereum blockchain. Built for the modern crypto ecosystem,
            JSN aims to empower users with seamless access to digital assets,
            while driving innovation in the DeFi space.
          </p>
        </div>
        <div className="relative flex items-center justify-center row-start-1 md:row-start-1 md:col-start-2">
          <Image
            src={Logo}
            alt="logo"
            className="w-[200px] lg:w-[300px] animateSpin !duration-[3000ms]"
          />
          <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
            <Image
              src={Logo}
              alt="logo"
              className="w-[70px] lg:w-[100px] animateSpin2 !duration-[3000ms]"
            />
          </div>
        </div>
      </section>
      <section className="flex gap-4 flex-col items-center justify-center w-full py-4 px-6 sm:px-16">
        <h2 className="text-4xl font-bold text-[#113946] mb-[1rem]">
          Tokenomics
        </h2>
        <div className="w-full flex items-center justify-center gap-8 flex-col md:flex-row md:w-[500px]">
          <Image
            src={Logo}
            className="w-[200px] animateSpin md:animate-bounce"
          ></Image>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2 text-[#113946]">
              <p className="font-bold text-2xl">Token Name</p>
              <p className="bg-white rounded-[10px] py-2 px-4 w-full md:w-[500px] border-[3px] border-[#BCA37F]">
                JSN Token
              </p>
            </div>
            <div className="flex flex-col gap-2 text-[#113946]">
              <p className="font-bold text-2xl">Symbol</p>
              <p className="bg-white rounded-[10px] py-2 px-4 w-full md:w-[500px] border-[3px] border-[#BCA37F]">
                JSN
              </p>
            </div>
            <div className="flex flex-col gap-2 text-[#113946]">
              <p className="font-bold text-2xl">Total Supply</p>
              <p className="bg-white rounded-[10px] py-2 px-4 w-full md:w-[500px] border-[3px] border-[#BCA37F]">
                {noOfToken ? noOfToken + " JSN" : "0 JSN"}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center gap-4 w-full py-4 px-16 mt-9">
        <h2 className="text-4xl font-bold text-[#113946] text-center">
          Transfer Token
        </h2>
        <div className="w-[80vw] lg:w-[50vw] bg-image">
          <div className=" w-full md:w-[60%] flex flex-col gap-3 py-8 px-4 bg-[rgba(255,255,255,.5)] clip">
            <div className="flex flex-col gap-2 text-[#113946]">
              <label htmlFor="address" className="font-bold text-xl">
                To Address
              </label>
              <input
                type="text"
                id="address"
                onChange={(e) => setInputAddrss(e.target.value)}
                className="bg-white outline-none rounded-[10px] py-2 px-4 w-full md:w-[85%] border-[3px] border-[#BCA37F]"
              />
            </div>
            <div className="flex flex-col gap-2 text-[#113946]">
              <label htmlFor="value" className="font-bold text-xl">
                value
              </label>
              <input
                type="number"
                id="value"
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-white outline-none rounded-[10px] py-2 px-4 w-full md:w-[85%] border-[3px] border-[#BCA37F]"
              />
            </div>
            <button
              onClick={transferToken}
              disabled={address?.length <= 0}
              className="bg-[#BCA37F] mt-2 py-2 px-2 flex w-full md:w-[85%] items-center justify-center rounded-[10px] font-bold text-white"
            >
              Transfer
            </button>
          </div>
        </div>
      </section>
      <section className="mt-8 w-full py-4 px-16 flex flex-col items-center justify-center gap-8">
        <h2 className="text-4xl font-bold text-[#113946]">Holders</h2>
        {holderArray?.length > 0 ? (
          <div
            className="grid gap-4 w-full "
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            }}
          >
            {holderArray?.map((item, index) => (
              <div
                key={index}
                className="border-[5px] rounded-[10px] border-[#BCA37F] flex flex-col items-center justify-center gap-4 p-8"
              >
                <p>
                  {item?._to
                    ? "User " +
                      item?._to.substring(0, 4) +
                      "..." +
                      item?._to.substr(-4)
                    : "Waiting to Connect Wallet..."}
                </p>
                <p className="w-[100%] p-4 bg-[#EAD7BB] text-center text-2xl">
                  {item?._totalToken
                    ? Number(item?._totalToken) + "JSN"
                    : "Waiting to Connect Wallet..."}
                </p>
                <p>
                  {item?._from
                    ? "Token transfer from " +
                      item?._from.substring(0, 4) +
                      "..." +
                      item?._from.substr(-4)
                    : "Waiting to Connect Wallet..."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          "Waiting to Connect Wallet..."
        )}
      </section>
    </div>
  );
}
