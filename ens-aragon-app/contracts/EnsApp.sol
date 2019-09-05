pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";
import "@aragon/apps-agent/contracts/Agent.sol";

import "./EnsInterface.sol";

contract EnsApp is AragonApp {

    /*
    * The ENS namehash("addr.reverse")
    * bytes32 reverseRootNode = keccak256(abi.encodePacked(bytes32(0), keccak256(abi.encodePacked("reverse"))));
    * bytes32 reverseRecordNode = keccak256(abi.encodePacked(reverseRootNode, keccak256(abi.encodePacked("addr"))));
    */
    bytes32 public constant reverseRecordNode = 0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2;

    bytes32 public constant SET_AGENT_ROLE = keccak256("SET_AGENT_ROLE");
    bytes32 public constant SET_REVERSE_RECORD_ROLE = keccak256("SET_REVERSE_RECORD_ROLE");

    Agent public agent;
    EnsInterface public ens;

    event AppInitialized();
    event NewAgentSet(address agent);
    event ReverseRecordSet(string domainName);

    function initialize(address _agent, address _ens) external onlyInit {
        agent = Agent(_agent);
        ens = EnsInterface(_ens);

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
        address reverseRegistrarAddress = ens.owner(reverseRecordNode);

        bytes memory encodedFunctionCall = abi.encodeWithSignature("setName(string)", _domainName);

        agent.safeExecute(reverseRegistrarAddress, encodedFunctionCall);

        emit ReverseRecordSet(_domainName);
    }

}
