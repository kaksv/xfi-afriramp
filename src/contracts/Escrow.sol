// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract XFiEscrow {
    using SafeERC20 for IERC20;
    
    
    address public constant RECIPIENT = 0xDD463C81cb2fA0e95b55c5d7696d8a9755cb1Af2;


    function _processDeposit(address token, uint256 amount) private {
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        IERC20(token).safeTransfer(RECIPIENT, amount);
    }
}

//Contract Address: 0xa5fe5890cf064B4D05f8bd0bADfA7dee14846C10
