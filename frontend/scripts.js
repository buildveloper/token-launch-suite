// frontend/scripts.js
async function createToken() {
  const name = document.getElementById("tokenName").value;
  const symbol = document.getElementById("tokenSymbol").value;
  const supply = document.getElementById("tokenSupply").value;
  const taxRate = document.getElementById("taxRate").value;
  const maxWallet = document.getElementById("maxWallet").value;
  const maxTx = document.getElementById("maxTx").value;
  const output = document.getElementById("tokenOutput");

  // Clear previous messages
  output.textContent = "";
  output.style.color = "black";

  try {
    // Basic validation
    if (!name || !symbol || !supply || !taxRate || !maxWallet || !maxTx) {
      throw new Error("Please fill all fields");
    }

    // Convert to numbers
    const numericValues = {
      supply: Number(supply),
      taxRate: Number(taxRate),
      maxWallet: Number(maxWallet),
      maxTx: Number(maxTx)
    };

    // Validate numbers
    for (const [key, value] of Object.entries(numericValues)) {
      if (isNaN(value)) throw new Error(`Invalid ${key} value`);
      if (value <= 0) throw new Error(`${key} must be greater than 0`);
    }

    console.log("Sending request:", { name, symbol, ...numericValues });
    
    const response = await fetch("http://localhost:3000/deploy", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Origin": window.location.origin
      },
      body: JSON.stringify({
        name,
        symbol,
        supply: numericValues.supply,
        taxRate: numericValues.taxRate,
        maxWallet: numericValues.maxWallet,
        maxTx: numericValues.maxTx
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Deployment failed");
    }

    if (!result.address) {
      throw new Error("Contract address missing in response");
    }

    console.log("Deployment successful:", result);
    output.style.color = "green";
    output.textContent = `✅ Token deployed successfully!\nAddress: ${result.address}`;
    output.innerHTML += `<br>Transaction Hash: ${result.txHash}`;

  } catch (error) {
    console.error("Error:", error.message);
    output.style.color = "red";
    output.textContent = `❌ Error: ${error.message}`;
    
    // Add retry button for network errors
    if (error.message.includes("Failed to fetch")) {
      const retryButton = document.createElement("button");
      retryButton.textContent = "Retry Deployment";
      retryButton.onclick = createToken;
      output.appendChild(retryButton);
    }
  }
}