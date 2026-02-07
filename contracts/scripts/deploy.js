const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const provider = new hre.ethers.providers.JsonRpcProvider(
    process.env.SEPOLIA_RPC_URL
  );

  const wallet = new hre.ethers.Wallet(
    process.env.DEPLOYER_PRIVATE_KEY,
    provider
  );

  console.log("Deploying with account:", wallet.address);

  const SkillCredential = await hre.ethers.getContractFactory(
    "SkillCredential",
    wallet
  );

  const contract = await SkillCredential.deploy(wallet.address);
  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});