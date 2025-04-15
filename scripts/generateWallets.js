const { ethers } = require("hardhat");

async function main() {
  const numWallets = 5;
  const wallets = [];

  for (let i = 0; i < numWallets; i++) {
    const wallet = ethers.Wallet.createRandom();
    wallets.push({
      address: wallet.address,
      privateKey: wallet.privateKey,
    });
  }

  console.log("Generated Wallets:", wallets);
}

main().catch(console.error);