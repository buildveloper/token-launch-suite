const hre = require("hardhat");

async function main() {
  const routerAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; 
  const router = await hre.ethers.getContractAt("MockUniswapV2Router", routerAddress);
  const wethAddress = await router.WETH();
  console.log("WETH address:", wethAddress);
}

main().catch(console.error);