// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockUniswapV2Router {
    address public WETH;

    constructor(address _weth) {
        WETH = _weth;
    }

    function addLiquidityETH(
        address,
        uint amountTokenDesired,
        uint,
        uint,
        address,
        uint
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity) {
        return (amountTokenDesired, msg.value, 1000);
    }

    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address,
        uint
    ) external payable returns (uint[] memory amounts) {
        amounts = new uint[](path.length);
        amounts[0] = msg.value;
        amounts[1] = amountOutMin == 0 ? 1000 : amountOutMin;
        return amounts;
    }
}