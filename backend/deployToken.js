const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");
const rateLimit = require("express-rate-limit");

const app = express();

// 1. Configure Ethereum provider
const provider = new ethers.JsonRpcProvider("http://localhost:8545");
let signer;

// Initialize signer asynchronously
(async () => {
  try {
    signer = await provider.getSigner();
    console.log("Connected to Ethereum account:", await signer.getAddress());
  } catch (error) {
    console.error("Error initializing signer:", error);
    process.exit(1);
  }
})();

// 2. Enhanced CORS configuration
const allowedOrigins = ["http://localhost:8000", "http://127.0.0.1:8000"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

// 3. Rate limiting only for deployment endpoint
const deploymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 deployment requests per window
  message: "Too many deployment attempts, please try again later"
});
app.use("/deploy", deploymentLimiter);

// 4. Improved preflight handling
app.options("/deploy", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(204);
});

// 5. Enhanced request body parsing
app.use(express.json({ limit: "10kb" }));

// 6. Deployment endpoint with detailed validation
app.post("/deploy", async (req, res) => {
  try {
    const { name, symbol, supply, taxRate, maxWallet, maxTx } = req.body;

    // Detailed validation
    const errors = [];
    if (!name) errors.push("Token name is required");
    if (!symbol) errors.push("Token symbol is required");
    if (!symbol || symbol.length > 8) errors.push("Symbol must be ≤ 8 characters");
    
    [supply, taxRate, maxWallet, maxTx].forEach((val, index) => {
      const field = ["supply", "taxRate", "maxWallet", "maxTx"][index];
      if (typeof val === "undefined") errors.push(`${field} is required`);
      if (isNaN(val)) errors.push(`${field} must be a number`);
      if (Number(val) <= 0) errors.push(`${field} must be greater than 0`);
    });

    if (errors.length > 0) {
      return res.status(400).json({ error: "Validation failed", details: errors });
    }

    // Convert values using ethers v6 syntax
    const decimals = 18;
    const parsedValues = {
      supply: ethers.parseUnits(supply.toString(), decimals),
      taxRate: Number(taxRate),
      maxWallet: ethers.parseUnits(maxWallet.toString(), decimals),
      maxTx: ethers.parseUnits(maxTx.toString(), decimals)
    };

    // Load contract artifacts
    const contractArtifact = require("../artifacts/contracts/CustomToken.sol/CustomToken.json");

    
    // Create contract factory
    const factory = new ethers.ContractFactory(
      contractArtifact.abi,
      contractArtifact.bytecode,
      signer
    );

    // Deploy contract
    // In the factory.deploy() call, add router address as last parameter
const contract = await factory.deploy(
  name,
  symbol,
  parsedValues.supply,
  parsedValues.taxRate,
  parsedValues.maxWallet,
  parsedValues.maxTx,
  "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" // Hardhat local router
);

    // Wait for deployment confirmation
    console.log("Waiting for confirmations...");
    await contract.waitForDeployment();
    
    // Get deployment details
    const deploymentReceipt = await contract.deploymentTransaction().wait(2);
    const contractAddress = await contract.getAddress();

    res.json({
      success: true,
      address: contractAddress,
      txHash: deploymentReceipt.hash,
      blockNumber: deploymentReceipt.blockNumber
    });

  } catch (error) {
    console.error("Deployment error:", error);
    res.status(500).json({
      error: "Deployment failed",
      details: error.message,
      ...(error.reason && { reason: error.reason })
    });
  }
});

// 7. Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
  console.log("Allowed origins:", allowedOrigins);
});