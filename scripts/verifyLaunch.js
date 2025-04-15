const hre = require("hardhat");

async function main() {
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const routerAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const wallets = [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 
    "0xB221D0A0604C9e078127b7Ff65dC0E1B526Ad7d3", 
  ];

  // Initialize contracts
  const token = await hre.ethers.getContractAt("CustomToken", tokenAddress);
  const router = await hre.ethers.getContractAt("MockUniswapV2Router", routerAddress);

  // 1. Check Token Balances
  console.log("=== Token Balances ===");
  for (const wallet of wallets) {
    const balance = await token.balanceOf(wallet);
    console.log(`Wallet ${wallet}: ${hre.ethers.formatUnits(balance, 18)} tokens`);
  }

  // 2. Verify Router WETH
  console.log("\n=== Router Verification ===");
  const wethAddress = await router.WETH();
  console.log(`Router WETH: ${wethAddress}`);
  console.log(`Expected WETH: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`);

  // 3. Check Token Supply
  console.log("\n=== Token Supply ===");
  const totalSupply = await token.totalSupply();
  console.log(`Total Supply: ${hre.ethers.formatUnits(totalSupply, 18)} tokens`);

  // 4. Mock Liquidity Check (since MockUniswapV2Router doesn't store pairs)
  console.log("\n=== Mock Liquidity Check ===");
  console.log("Mock router used for liquidity - check addLiquidity.js logs for amounts");
  // Note: Real Uniswap V2 would require checking the pair contract, but mock returns dummy values
}

main().catch(console.error);