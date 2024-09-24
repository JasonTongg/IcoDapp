import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import Web3Modal from "web3modal"; // Import Web3Modal
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";

const projectId = "d4e79a3bc1f5545a422926acb6bb88b8";

const sepolia = {
  chainId: 11155111, // Chain ID for Sepolia testnet
  name: "Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io",
  rpcUrl: "https://sepolia.infura.io/v3/7501310bfbe94f0fb0f9bf0c190a0a64",
};

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
        allTokenHolder.map(async (item) => {
          const singleHolderData = await contract.getTokenHolderData(item);
          holderArray.push(singleHolderData);
          console.log(holderArray);
        });
      } catch (error) {
        console.error("Error Get Transaction Count: ", error);
      }
    }
  };

  const transferToken = async (toAddress, value) => {
    if (contract) {
      try {
        const transfer = await contract.transfer(toAddress, BigInt(+value));
        contract.on("Transfer", (from, to, value) => {
          console.log(
            `Transfer Token executed: from ${from} to ${to} for ${amount} ETH`
          );
          // toast.success("Transaction Has Been Added to Sepolia Blockchain...", {
          //   theme: "dark",
          // });
        });
      } catch (error) {
        console.error("Error Transfer Token: ", error);
      }
    }
  };

  const connectContract = async () => {
    if (isConnected && contract) {
      // console.log("before get transaction");
      // getTransaction();
      // console.log("after get transaction");
      // getTransactionCount();
      // getBalance();
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
  };

  const getBalance = async () => {
    if (isConnected && ethersProvider) {
      try {
        const balance = await ethersProvider.getBalance(address);
        setBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error("Error fetching balance: ", error);
      }
    }
  };

  useEffect(() => {
    if (isConnected) {
      connectContract();
      console.log(address);
    }
  }, [contract, isConnected]);

  return <div>Home</div>;
}
