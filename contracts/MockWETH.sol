// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockWETH {
    string public name = "Wrapped Ether";
    string public symbol = "WETH";
    uint8 public decimals = 18;

    function deposit() external payable {}
    function withdraw(uint wad) external {}
}