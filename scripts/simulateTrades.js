const { ethers } = require("hardhat");

async function main() {
  const routerAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"; // Mock Router
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // CustomToken
  const wallet = {
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  };

  const router = await ethers.getContractAt("MockUniswapV2Router", routerAddress);
  const provider = ethers.provider;
  const signer = new ethers.Wallet(wallet.privateKey, provider);

  const ethAmount = ethers.parseUnits("0.1", 18);
  await router.connect(signer).swapExactETHForTokens(
    0,
    [await router.WETH(), tokenAddress],
    wallet.address,
    Math.floor(Date.now() / 1000) + 600,
    { value: ethAmount }
  );
  console.log(`Bought tokens with ${ethAmount} ETH from ${wallet.address}`);
}

main().catch(console.error);