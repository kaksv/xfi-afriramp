// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract afriramp {

    struct transactInfo {
        uint Time; 
        uint Amount;
    } 

    mapping (address => transactInfo[]) public Transactions;
   

    address constant afrirampAddress = 0xDD463C81cb2fA0e95b55c5d7696d8a9755cb1Af2;

    receive() external payable {

        Transactions[msg.sender].push(transactInfo(block.timestamp,msg.value));
        
        payable(afrirampAddress).call{value:msg.value}("");
    }
}
