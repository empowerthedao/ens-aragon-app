pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";
import "@aragon/apps-agent/contracts/Agent.sol";

contract EnsApp is AragonApp {

    bytes32 public constant SET_AGENT_ROLE = keccak256("SET_AGENT_ROLE");
    bytes32 public constant SET_REVERSE_RECORD_ROLE = keccak256("SET_REVERSE_RECORD_ROLE");

    Agent public agent;

    event AppInitialized();
    event NewAgentSet(address agent);

    function initialize(address _agent) external onlyInit {
        agent = Agent(_agent);

        initialized();

        emit AppInitialized();
    }

    /**
    * @notice Update the Agent address to `_agent`
    * @param _agent New Agent address
    */
    function setAgent(address _agent) external auth(SET_AGENT_ROLE) {
        agent = Agent(_agent);
        emit NewAgentSet(_agent);
    }

    /**
    * @notice Set the ENS reverse record for the Agent to `_domainName`
    * @param _domainName New Agent address
    */
    function setReverseRecord(string _domainName) external auth(SET_REVERSE_RECORD_ROLE) {

    }
}
