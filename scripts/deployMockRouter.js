const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  // Deploy MockWETH
  const WETH = await hre.ethers.getContractFactory("MockWETH");
  const weth = await WETH.deploy();
  await weth.waitForDeployment();
  const wethAddress = await weth.getAddress();
  console.log("WETH deployed to:", wethAddress);

  // Deploy MockUniswapV2Router
  const MockUniswapV2Router = await hre.ethers.getContractFactory("MockUniswapV2Router");
  const router = await MockUniswapV2Router.deploy(wethAddress);
  await router.waitForDeployment();
  const routerAddress = await router.getAddress();
  console.log("Mock Router deployed to:", routerAddress);
}

main().catch(console.error);