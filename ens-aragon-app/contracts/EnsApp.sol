pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";
import "@aragon/apps-agent/contracts/Agent.sol";

import "./EnsInterface.sol";

contract EnsApp is AragonApp {

    /*
    * The ENS namehash/node of "addr.reverse"
    * bytes32 reverseRootNode = keccak256(abi.encodePacked(bytes32(0), keccak256(abi.encodePacked("reverse"))));
    * bytes32 reverseRecordNode = keccak256(abi.encodePacked(reverseRootNode, keccak256(abi.encodePacked("addr"))));
    */
    bytes32 public constant reverseRecordNode = 0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2;

    bytes32 public constant SET_AGENT_ROLE = keccak256("SET_AGENT_ROLE");
    bytes32 public constant SET_ENS_ROLE = keccak256("SET_ENS_ROLE");
    bytes32 public constant SET_REVERSE_RECORD_ROLE = keccak256("SET_REVERSE_RECORD_ROLE");

    string private constant ERROR_NOT_CONTRACT = "ENS_NOT_CONTRACT";

    Agent public agent;
    EnsInterface public ens;

    event AppInitialized();
    event NewAgentSet(address agent);
    event NewEnsSet(address ens);
    event ReverseRecordSet(string domainName);

    /**
    * @notice Initialize the ENS App
    * @param _agent The Agent contract address
    * @param _ens The ENS Registry address
    */
    function initialize(address _agent, address _ens) external onlyInit {
        require(isContract(_agent), ERROR_NOT_CONTRACT);
        require(isContract(_ens), ERROR_NOT_CONTRACT);

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
        require(isContract(_agent), ERROR_NOT_CONTRACT);

        agent = Agent(_agent);
        emit NewAgentSet(_agent);
    }

    /**
    * @notice Update the ENS address to `_ens`
    * @param _ens New ENS address
    */
    function setEns(address _ens) external auth(SET_ENS_ROLE) {
        require(isContract(_ens), ERROR_NOT_CONTRACT);

        ens = EnsInterface(_ens);
        emit NewEnsSet(_ens);
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
