// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";

contract CustomToken is ERC20, Ownable {
    uint256 public taxRate;
    uint256 public maxWallet;
    uint256 public maxTx;
    bool public tradingEnabled = false;
    
    IUniswapV2Router02 public uniswapV2Router;
    address public uniswapV2Pair;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 _taxRate,
        uint256 _maxWallet,
        uint256 _maxTx,
        address _routerAddress
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
        taxRate = _taxRate;
        maxWallet = _maxWallet;
        maxTx = _maxTx;
        
        // Initialize Uniswap V2
        uniswapV2Router = IUniswapV2Router02(_routerAddress);
        uniswapV2Pair = IUniswapV2Factory(uniswapV2Router.factory())
            .createPair(address(this), uniswapV2Router.WETH());
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(tradingEnabled || msg.sender == owner(), "Trading disabled");
        require(amount <= maxTx, "Exceeds max transaction");
        
        uint256 taxAmount = (amount * taxRate) / 10000;
        uint256 amountAfterTax = amount - taxAmount;
        
        if (recipient != owner()) {
            require(balanceOf(recipient) + amountAfterTax <= maxWallet, "Exceeds max wallet");
        }
        
        _transfer(msg.sender, recipient, amountAfterTax);
        if (taxAmount > 0) {
            _transfer(msg.sender, owner(), taxAmount);
        }
        return true;
    }

    function addLiquidity(uint256 tokenAmount, uint256 ethAmount) external onlyOwner {
        _approve(owner(), address(uniswapV2Router), tokenAmount);
        uniswapV2Router.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0,
            0,
            owner(),
            block.timestamp
        );
    }

    function enableTrading() external onlyOwner {
        tradingEnabled = true;
    }

    // Needed to accept ETH from liquidity additions
    receive() external payable {}
}