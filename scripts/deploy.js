const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying from:", deployer.address);

    // Define token parameters
  const tokenName = "CustomToken";
  const tokenSymbol = "CTK";
  const initialSupply = hre.ethers.parseUnits("1000000", 18); // 1M tokens with 18 decimals
  const taxRate = 100; // 1% tax (100 basis points)
  const maxWallet = hre.ethers.parseUnits("10000", 18); // Max 10K tokens per wallet
  const maxTx = hre.ethers.parseUnits("5000", 18); // Max 5K tokens per transaction

     // Get the contract factory and deploy
  const CustomToken = await hre.ethers.getContractFactory("CustomToken");
  const token = await CustomToken.deploy(
    tokenName,
    tokenSymbol,
    initialSupply,
    taxRate,
    maxWallet,
    maxTx
  );

  // Wait for deployment to finish
  await token.waitForDeployment();

   // Log the contract address
  console.log("CustomToken deployed to:", await token.getAddress());
};

// Run the script and handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});