// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { ethers } = require("hardhat");
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ContractModule = buildModule("ContractModule", (m) => {
  // Pass the necessary argument(s) for the constructor of Token.
  const token = m.contract("Token", [100000000000000]);

  return { token };
});

module.exports = ContractModule;
