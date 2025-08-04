// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract BaseEscrow {
    using SafeERC20 for IERC20;
    
    // Base Mainnet addresses
    address public constant USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    // address public constant USDT = 0x6cA4b8dD6D8C36471B2b6d4a2A5B9F305c9b2eC9;
    address public constant RECIPIENT = 0xDD463C81cb2fA0e95b55c5d7696d8a9755cb1Af2;

    function depositUSDC(uint256 amount) external {
        _processDeposit(USDC, amount);
    }

    // function depositUSDT(uint256 amount) external {
    //     _processDeposit(USDT, amount);
    // }

    function _processDeposit(address token, uint256 amount) private {
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        IERC20(token).safeTransfer(RECIPIENT, amount);
    }
}

//Contract Address: 0xa5fe5890cf064B4D05f8bd0bADfA7dee14846C10
