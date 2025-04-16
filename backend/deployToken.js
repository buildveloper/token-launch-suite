// backend/deployToken.js
const express = require("express");
const cors = require("cors");
const { ethers } = require("hardhat");

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:8000" }));

app.post("/deploy", async (req, res) => {
  console.log("Request received:", req.body);
  const { name, symbol, supply } = req.body;
  try {
    if (!name || !symbol || supply == null) {
      console.log("Validation failed: Missing fields");
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Explicitly get ethers from Hardhat
    const ethers = hre.ethers;
    if (!ethers) {
      throw new Error("ethers is not available in Hardhat environment");
    }
    const supplyBN = ethers.utils.parseUnits(supply.toString(), 18);
    console.log("Parsed supply:", supplyBN.toString());
    console.log("Deploying CustomToken...");
    const Token = await ethers.getContractFactory("CustomToken");
    const token = await Token.deploy(name, symbol, supplyBN);
    console.log("Waiting for deployment...");
    const deployedToken = await token.deployed();
    console.log("Deployed at:", deployedToken.address);
    if (!deployedToken.address) {
      throw new Error("Deployment succeeded but no address returned");
    }
    res.json({ address: deployedToken.address });
  } catch (error) {
    console.error("Deployment error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));