const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const routerAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  const token = await hre.ethers.getContractAt("CustomToken", tokenAddress);
  const router = await hre.ethers.getContractAt("IUniswapV2Router02", routerAddress);

  const tokenAmount = hre.ethers.parseUnits("10000", 18);
  const ethAmount = hre.ethers.parseUnits("1", 18);      

  await token.approve(routerAddress, tokenAmount);
  console.log("Router approved to spend tokens");

  await router.addLiquidityETH(
    tokenAddress,
    tokenAmount,
    0, 
    0, 
    deployer.address,
    Math.floor(Date.now() / 1000) + 600,
    { value: ethAmount }
  );
  console.log("Liquidity added successfully");
}

main().catch(console.error);