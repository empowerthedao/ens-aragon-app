This script will use aragonCLI to:

- Create a new Aragon DAO on Rinkeby
- Install and configure the ENS Aragon App

This new DAO will be able to set a reverse record on ENS.

### Pre-requisites

The following are required for completing this script:

- `aragonCLI` must be installed in your environment. Here is a [link to an introduction to aragonCLI](https://hack.aragon.org/docs/cli-intro.html).

- You must know your `<AragonCLI-Address>`, which is the address for the private key being used by your aragonCLI to sign transactions.

**During this script, new addresses will be created which will be required for further commands.**

### Create a new Aragon DAO on Rinkeby

Run the following command to **create a new DAO**:

```
dao new --environment aragon:rinkeby
```

> This returns `Created DAO: <DAO-Address>` for use in future commands.

### Create a Voting token

Run the following command to **create the voting token**:

```
dao token new "ENSDAOToken" "ENSDAO" 0 --environment aragon:rinkeby
```

> This returns `Successfully deployed the token at <DAO-Token-Address>` for use in future commands.

### Install and configure the Tokens app in the DAO

Run the following command to **install the Tokens app in the DAO**:

```
dao install <DAO-Address> token-manager --app-init none --environment aragon:rinkeby
```

> This returns `Installed token-manager at: <Token-Manager-Proxy-Address>` for use in future commands.

Run the following commands to **configure the voting token and configure the Tokens app**:

```
dao token change-controller <DAO-Token-Address> <Token-Manager-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <Token-Manager-Proxy-Address> MINT_ROLE <AragonCLI-Address> <AragonCLI-Address> --environment aragon:rinkeby
dao exec <DAO-Address> <Token-Manager-Proxy-Address> initialize <DAO-Token-Address> true 0 --environment aragon:rinkeby
dao exec <DAO-Address> <Token-Manager-Proxy-Address> mint <AragonCLI-Address> 1 --environment aragon:rinkeby
```

### Install and configure the Voting app in the DAO

Run the following command to **install the Voting app in the DAO and initialize it**:

```
dao install <DAO-Address> voting --app-init-args <DAO-Token-Address> 500000000000000000 500000000000000000 3600 --environment aragon:rinkeby
```

> This returns `Installed voting at: <Voting-App-Proxy-Address>` for use in future commands.

Run the following command to **configure the Voting app**:

```
dao acl create <DAO-Address> <Voting-App-Proxy-Address> CREATE_VOTES_ROLE <Token-Manager-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
```

### Install the Agent app in the DAO

Run the following command to **install the Agent app in the DAO**:

```
dao install <DAO-Address> agent --environment aragon:rinkeby
```

> This returns `Installed agent at: <Agent-App-Proxy-Address>` for use in future commands.

You have now created a new Aragon DAO on Rinkeby with voting token and base apps.

### Install the ENS Aragon App

Run the following command to **install the ENS app in the DAO**:

```
dao install <DAO-Address> ens.open.aragonpm.eth --app-init-args <Agent-App-Proxy-Address> <ENS-Interface-Address> --environment aragon:rinkeby
```

> For `<ENS-Interface-Address>`, you can use `0x471865214aac00124AB122eDBf0260dfee105213` which is an [address for an ENS interface](https://rinkeby.etherscan.io/address/0x471865214aac00124AB122eDBf0260dfee105213) on Rinkeby.

> This returns `Installed ens.open.aragonpm.eth at: <ENS-App-Proxy-Address>` for use in future commands.

### Configure the Agent app

In order for the ENS Aragon App to transact via the Agent, the following commands need to be run, to set the permissions on the Agent app:

```
dao acl create <DAO-Address> <Agent-App-Proxy-Address> SAFE_EXECUTE_ROLE <ENS-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
```

### Configure the ENS Aragon App

In order for all operations by ENS Aragon App to be governed by a vote, the following commands need to be run:

```
dao acl create <DAO-Address> <ENS-App-Proxy-Address> SET_REVERSE_RECORD_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
dao acl create <DAO-Address> <ENS-App-Proxy-Address> SET_AGENT_ROLE <Voting-App-Proxy-Address> <Voting-App-Proxy-Address> --environment aragon:rinkeby
```

You can now visit the DAO's Home page at `https://rinkeby.aragon.org/#/<DAO-Address>`

You can also view the ENS App at `https://rinkeby.aragon.org/#/<DAO-Address>/<ENS-App-Proxy-Address>`
