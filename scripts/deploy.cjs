
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
const hre = require("hardhat");

async function main() {
  console.log("Deploying ProductVerification contract...");

  // Get the Contract factory
  const ProductVerification = await hre.ethers.getContractFactory("ProductVerification");
  
  // Deploy the contract
  const productVerification = await ProductVerification.deploy();

  // Wait for deployment to finish
  await productVerification.waitForDeployment();

  console.log(`ProductVerification contract deployed to: ${productVerification.target}`);
  console.log("Copy this address and update it in src/services/blockchainService.ts");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
