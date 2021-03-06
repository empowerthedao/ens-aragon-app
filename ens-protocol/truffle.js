/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

const homedir = require('homedir')
const path = require('path')

const HDWalletProvider = require('truffle-hdwallet-provider')
const HDWalletProviderPrivkey = require('truffle-hdwallet-provider-privkey')

const DEFAULT_MNEMONIC = 'stumble story behind hurt patient ball whisper art swift tongue ice alien'

const defaultRPC = (network) =>
    `https://${network}.infura.io`

const configFilePath = (filename) =>
    path.join(homedir(), `.aragon/${filename}`)

const mnemonic = () => {
    try {
        return require(configFilePath('mnemonic.json')).mnemonic
    } catch (e) {
        return DEFAULT_MNEMONIC
    }
}

const settingsForNetwork = (network) => {
    try {
        return require(configFilePath(`${network}_key.json`))
    } catch (e) {
        return { }
    }
}

// Lazily loaded provider
const providerForNetwork = (network) => (
    () => {
        let { rpc, keys } = settingsForNetwork(network)

        rpc = rpc || defaultRPC(network)

        if (!keys || keys.length == 0) {
            return new HDWalletProvider(mnemonic(), rpc)
        }

        return new HDWalletProviderPrivkey(keys, rpc)
    }
)

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*"
        },
        rinkeby: {
            network_id: 4,
            provider: providerForNetwork('rinkeby'),
            gas: 6.9e6,
            gasPrice: 15000000001,
            skipDryRun: true
        },
    }
};
