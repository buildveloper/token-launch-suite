// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Importing OpenZeppelin Contracts
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; // I imported Ownable to enable me control the contract as a owner

contract CustomToken is ERC20, Ownable {
    //custom variables definition
    uint256 public taxRate;  //uint means unsigned integer, which means i can only assign a whole positive number to it, its different from normal integer keyword
    uint256 public maxWallet;  
    uint256 public maxTx;  
    bool public tradingEnabled = false;  

    //constructor is a special function that runs after i deploy it sets up the token name, initial supply and e.t.c
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _taxRate,
        uint256 _maxWallet,
        uint256 _maxTx
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
        taxRate = _taxRate;
        maxWallet = _maxWallet;
        maxTx = _maxTx;
    }

    //the transfer functions with some minimal changes
    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(tradingEnabled || msg.sender == owner(), "Trading is not enabled yet");
        require(amount <= maxTx, "Transfer exceeds max transaction amount");
        
        uint256 taxAmount = (amount * taxRate) / 10000;  
        uint256 amountAfterTax = amount - taxAmount; 
        
        if (recipient != owner()) {
            require(balanceOf(recipient) + amountAfterTax <= maxWallet, "Recipient would exceed max wallet");
        }
        
        _transfer(msg.sender, recipient, amountAfterTax);  
        if (taxAmount > 0) {
            _transfer(msg.sender, owner(), taxAmount);  
        }
        return true;
    }

    function enableTrading() external onlyOwner {
        tradingEnabled = true;
    }
}