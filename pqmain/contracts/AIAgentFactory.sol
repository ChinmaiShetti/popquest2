// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./AIAgent.sol";

contract AIAgentFactory {
    address[] public deployedAgents;

    event AgentDeployed(address indexed agentAddress, address indexed owner, string name);

    function deployAgent(string memory name) external returns (address) {
        AIAgent agent = new AIAgent(msg.sender, name);
        deployedAgents.push(address(agent));
        emit AgentDeployed(address(agent), msg.sender, name);
        return address(agent);
    }

    function getDeployedAgents() external view returns (address[] memory) {
        return deployedAgents;
    }
}
