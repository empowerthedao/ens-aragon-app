# Local deployment

To deploy the ENS Aragon app locally first requires installing the ENS protocol locally, then copying key 
addresses from the deployment process into the Aragon app deployment script for the app to use. It is also advised that
all global dependencies be the most recent versions available, except for Node.

Pre-requisite dependencies:
- [NPM from Node v10](https://nodejs.org/en/download/)
- [Aragon CLI](https://github.com/aragon/aragon-cli)
- [Truffle](https://github.com/trufflesuite/truffle)
- [MetaMask](https://metamask.io/)

## ENS Protocol Deployment

This process deploys the ENS protocol to a local test chain as it is currently deployed on Mainnet, including a reverse registrar. 

Instructions are for OSX, other OS's may require additional steps.

Execute the following within the `ens-aragon-app/ens-protocol` directory:

Install dependencies:
```
$ npm install
```

Run a test chain in a separate terminal:
```
$ aragon devchain
```

Deploy ENS and the reverse registrar:
```
$ truffle migrate
```

## ENS Protocol Scripts (Optional)
Scripts to emulate activity on the ENS protocol. 

To execute the scripts requires the contracts first be compiled with:
```
$ truffle compile
```

Register a domain and transfer ownership to the account specified. Requires the Agent address be set to the const 
`NEW_OWNER` in the script:
```
$ truffle exec scripts/registerAndTransfer.js
```

> This is used to test the UI that displays whether or not the Agent owns the domain it's attempting to add through
 the reverse register.
 
## ENS Aragon App Deployment

Execute the following within the `ens-aragon-app/ens-aragon-app` directory.

Install dependencies:
```
$ npm install
```

Copy the ENS address to the Aragon app deployment script:
- In the truffle migration output, find the `ENSRegistry` deployment and copy the `contract address`
- Open `ens-aragon-app/package.json` and paste the address into the `start:http:template` command as the last 
argument, replace the address that is already there. 

Serve the web portion of the Aragon app locally:
```
$ npm run start:app
```

Create a DAO and install an instance of the ENS Aragon app (requires canceling and re-executing on contract updates):
```
$ npm run start:http:template
```

After these steps have completed your web browser should open Aragon automatically with the ENS app installed. The
template is setup to give permissions for executing all of the functionality to any address so you should be able to
experiment straight away. 

Any changes made to the web portion of the app should update without any redeployment of the app.  

Any changes to `script.js` require rebuilding the script, to do this execute the following in the `ens-aragon-app/app` directory:
```
$ npm run build:script
```

For further instructions and alternative approaches to deploying Aragon apps locally, see the official 
[react app template](https://github.com/aragon/aragon-react-boilerplate).