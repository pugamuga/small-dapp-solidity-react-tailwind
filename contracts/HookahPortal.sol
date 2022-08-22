// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract HookahPortalContract {

    uint256 totalHookah;

    address payable public owner;

    event NewHookah(
        address indexed from,
        uint256 timestamp,
        string message,
        string name
    );

    constructor() payable {
        owner = payable(msg.sender);
    }

    struct Hookah{
        address giver; // The address of the user who buys me a coffee.
        string messege; // The message the user sent.
        string name; // The name of the user who buys me a coffee.
        uint256 timestamp; // The timestamp when the user buys me a coffee.
    }

    Hookah[] hookah;

    function getAllHookah() public view returns(Hookah[] memory){
        return hookah;
    }

    function getTotalHookah() public view returns(uint256){
        return totalHookah;
    }

    function buyHookah (
        string memory _message,
        string memory _name,
        uint256 _amountPayment
    ) public payable {
        uint256 cost = 0.001 ether;
        require(_amountPayment>=cost, 'Give me more!!!');
        totalHookah = totalHookah + 1;

        hookah.push(Hookah(msg.sender, _message, _name, block.timestamp));

        (bool success, ) = owner.call{value: _amountPayment }('');
        require(success, "Failed to send money on Hookah:("); 

        emit NewHookah(msg.sender, block.timestamp, _message, _name);
    }

}