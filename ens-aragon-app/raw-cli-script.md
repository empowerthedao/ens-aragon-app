```
<AragonCLI-Address>

dao new --environment aragon:rinkeby
dao token new "ENSDAOToken" "ENSDAO" 0 --environment aragon:rinkeby

<DAO-Address>
<DAO-Token-Address>

dao install <DAO-Address> token-manager --app-init none --environment aragon:rinkeby

<Token-Manager-Proxy-Address>

dao token change-controller <DAO-Token-Address> <Token-Manager-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Token-Manager-Proxy-Address> MINT_ROLE <AragonCLI-Address> <AragonCLI-Address> --environment aragon:rinkeby
dao exec <DAO-Address> <Token-Manager-Proxy-Address> initialize <DAO-Token-Address> true 0 --environment aragon:rinkeby
dao exec <DAO-Address> <Token-Manager-Proxy-Address> mint <AragonCLI-Address> 1 --environment aragon:rinkeby

dao install <DAO-Address> voting --app-init-args <DAO-Token-Address> 500000000000000000 500000000000000000 3600 --environment aragon:rinkeby

<Voting-App-Proxy-Address>

dao acl create <DAO-Address> <Voting-App-Proxy-Address> CREATE_VOTES_ROLE <Token-Manager-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby

dao install <DAO-Address> agent --environment aragon:rinkeby

<Agent-App-Proxy-Address>

dao install <DAO-Address> ens.open.aragonpm.eth --app-init-args <Agent-App-Proxy-Address> <ENS-Interface-Address> --environment aragon:rinkeby

<ENS-Interface-Address> = 0x471865214aac00124AB122eDBf0260dfee105213

<ENS-App-Proxy-Address>

dao acl create <DAO-Address> <Agent-App-Proxy-Address> SAFE_EXECUTE_ROLE <ENS-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby

dao acl create <DAO-Address> <ENS-App-Proxy-Address> SET_REVERSE_RECORD_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <ENS-App-Proxy-Address> SET_AGENT_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby

https://rinkeby.aragon.org/#/<DAO-Address>
```
