# ENS Protocol Local Deployment

Instructions are for OSX, other OS's may require additional steps.

Pre-requisite dependencies:
- [NPM](https://nodejs.org/en/download/)
- [Ganache CLI](https://github.com/trufflesuite/ganache-cli) or [Aragon CLI](https://github.com/aragon/aragon-cli)
- [Truffle](https://github.com/trufflesuite/truffle)

To deploy ENS to a local ganache instance/aragon devchain, run the following in the `ens-aragon-app/ens-protocol` directory:

Install dependencies:
```
$ npm install
```

Run ganache in a separate terminal:
```
$ ganache-cli
```

Deploy contracts and execute basic usage:
```
$ truffle migrate
```