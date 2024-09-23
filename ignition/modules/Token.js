// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ContractModule = buildModule("ContractModule", (m) => {
  const token = m.contract("Token");

  return { token };
});

module.exports = ContractModule;
