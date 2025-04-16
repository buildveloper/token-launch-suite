// frontend/scripts.js
async function createToken() {
    const name = document.getElementById("tokenName").value;
    const symbol = document.getElementById("tokenSymbol").value;
    const supply = document.getElementById("tokenSupply").value;
    const output = document.getElementById("tokenOutput");
  
    if (!name || !symbol || !supply) {
      output.textContent = "Please fill all fields.";
      return;
    }
  
    try {
      console.log("Sending request:", { name, symbol, supply });
      const response = await fetch("http://localhost:3000/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, symbol, supply: parseInt(supply) }), // Ensure supply is number
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP ${response.status}: ${errorData.error || "Unknown error"}`);
      }
      const result = await response.json();
      console.log("Backend response:", result); // Debug full response
      if (!result.address) {
        throw new Error("No address in response");
      }
      output.textContent = `Token deployed at: ${result.address}`;
    } catch (error) {
      console.error("Error:", error.message);
      output.textContent = `Error: ${error.message}`;
    }
  }