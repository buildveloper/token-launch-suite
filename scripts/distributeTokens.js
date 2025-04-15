const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const token = await ethers.getContractAt("CustomToken", tokenAddress);

  const wallets = [
    { address: "0xB221D0A0604C9e078127b7Ff65dC0E1B526Ad7d3" }, 
    { address: "0xbdDe3bA1A743204d03C87238C5493FF925dE6546" },
    { address: "0x427067A4202DfE422de1ebbf0aABBdDCC867B42e" },
    { address: "0x3fe10034Da71EdF42B67078e6B63C186350DE7B7" },
    { address: "0x67E27dC482586333C7Cc17BFD22dB0B3213e3257" },
    
  ];
  const amountPerWallet = ethers.parseUnits("1000", 18); 

  for (const wallet of wallets) {
    await token.transfer(wallet.address, amountPerWallet);
    console.log(`Sent ${amountPerWallet} tokens to ${wallet.address}`);
  }
}

main().catch(console.error);