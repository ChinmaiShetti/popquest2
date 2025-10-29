// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title AIAgent
 * @notice Minimal agent contract that can hold ETH, pay a service, and send ETH.
 */
contract AIAgent {
    address public owner;
    string public name;

    event API_Paid(address indexed agent, address indexed service, uint256 amount);
    event Transfer_Made(address indexed from, address indexed to, uint256 amount);
    event Deposited(address indexed by, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    constructor(address _owner, string memory _name) {
        owner = _owner;
        name = _name;
    }

    receive() external payable {
        emit Deposited(msg.sender, msg.value);
    }

    function deposit() external payable {
        emit Deposited(msg.sender, msg.value);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function payForAPI(address payable service) external payable onlyOwner {
        require(msg.value > 0, "send some ether to pay");
        (bool s, ) = service.call{value: msg.value}("");
        require(s, "transfer failed");
        emit API_Paid(address(this), service, msg.value);
    }

    function sendTo(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "insufficient balance");
        (bool s, ) = to.call{value: amount}("");
        require(s, "transfer failed");
        emit Transfer_Made(address(this), to, amount);
    }

    function changeOwner(address newOwner) external onlyOwner {
        owner = newOwner;
    }
}