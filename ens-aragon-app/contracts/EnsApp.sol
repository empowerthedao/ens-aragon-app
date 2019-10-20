pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/math/SafeMath.sol";
import "@aragon/apps-agent/contracts/Agent.sol";

import "./EnsInterface.sol";

contract EnsApp is AragonApp {

    /* The ENS namehash/node of "addr.reverse"
        bytes32 reverseRootNode = keccak256(abi.encodePacked(bytes32(0), keccak256(abi.encodePacked("reverse"))));
        bytes32 reverseRecordNode = keccak256(abi.encodePacked(reverseRootNode, keccak256(abi.encodePacked("addr"))));
    */
    bytes32 public constant reverseRecordNode = 0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2;

    /* Hardcoded constants to save gas
        bytes32 public constant SET_AGENT_ROLE = keccak256("SET_AGENT_ROLE");
        bytes32 public constant SET_ENS_ROLE = keccak256("SET_ENS_ROLE");
        bytes32 public constant SET_REVERSE_RECORD_ROLE = keccak256("SET_REVERSE_RECORD_ROLE");
    */
    bytes32 public constant SET_AGENT_ROLE = 0xf57d195c0663dd0e8a2210bb519e2b7de35301795015198efff16e9a2be238c8;
    bytes32 public constant SET_ENS_ROLE = 0x6b5974c0d18cae1ec1fd711803ca26d89e67ec8149583d45687d8d30583a8512;
    bytes32 public constant SET_REVERSE_RECORD_ROLE = 0xc09a52c5ad7fc39d62ecde55286fc9d601355c6ff768ff16301240f741290090;

    string private constant ERROR_AGENT_NOT_CONTRACT = "ENS_AGENT_NOT_CONTRACT";
    string private constant ERROR_ENS_NOT_CONTRACT = "ENS_ENS_NOT_CONTRACT";

    Agent public agent;
    EnsInterface public ens;

    event AppInitialized();
    event NewAgentSet(address agent);
    event NewEnsSet(address ens);
    event ReverseRecordSet(string domainName, address agent);

    /**
    * @notice Initialize the ENS App
    * @param _agent The Agent contract address
    * @param _ens The ENS Registry address
    */
    function initialize(Agent _agent, EnsInterface _ens) external onlyInit {
        require(isContract(address(_agent)), ERROR_AGENT_NOT_CONTRACT);
        require(isContract(address(_ens)), ERROR_ENS_NOT_CONTRACT);

        agent = _agent;
        ens = _ens;

        initialized();
        emit AppInitialized();
    }

    /**
    * @notice Update the Agent address to `_agent`
    * @param _agent New Agent address
    */
    function setAgent(Agent _agent) external auth(SET_AGENT_ROLE) {
        require(isContract(address(_agent)), ERROR_AGENT_NOT_CONTRACT);

        agent = _agent;
        emit NewAgentSet(address(_agent));
    }

    /**
    * @notice Update the ENS address to `_ens`
    * @param _ens New ENS address
    */
    function setEns(EnsInterface _ens) external auth(SET_ENS_ROLE) {
        require(isContract(address(_ens)), ERROR_ENS_NOT_CONTRACT);

        ens = _ens;
        emit NewEnsSet(address(_ens));
    }

    /**
    * @notice Set the ENS reverse record for the Agent to `_domainName`
    * @param _domainName Agent owned domain name
    */
    function setReverseRecord(string _domainName) external auth(SET_REVERSE_RECORD_ROLE) {
        address reverseRegistrarAddress = ens.owner(reverseRecordNode);

        bytes memory encodedFunctionCall = abi.encodeWithSignature("setName(string)", _domainName);

        agent.safeExecute(reverseRegistrarAddress, encodedFunctionCall);

        emit ReverseRecordSet(_domainName, address(agent));
    }

}
