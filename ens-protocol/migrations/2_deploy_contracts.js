const ENS = artifacts.require('ENSRegistry')
const HashRegistrar = artifacts.require('HashRegistrar')
const BaseRegistrar = artifacts.require('./BaseRegistrarImplementation')
const ETHRegistrarController = artifacts.require('./ETHRegistrarController')
const SimplePriceOracle = artifacts.require('./SimplePriceOracle')
const ReverseRegistrar = artifacts.require('ReverseRegistrar')
const PublicResolver = artifacts.require('PublicResolver')

const namehash = require('eth-ens-namehash')
const Promise = require('bluebird')
const sha3 = web3.utils.sha3

const ETH_TLD = 'eth'
const ROOT_NODE = '0x0'
const DAYS = 24 * 60 * 60
const MIN_COMMITMENT_PERIOD = 60 // 60 seconds
const MAX_COMMITMENT_PERIOD = 86400 // 24 hours
const DOMAIN_PRICE_PER_SECOND = 1

const REVERSE_TLD = 'reverse'
const REVERSE_ADDR_DOMAIN = 'addr'

const advanceTime = Promise.promisify(function(delay, done) {
        web3.currentProvider.send({
            jsonrpc: "2.0",
            "method": "evm_increaseTime",
            params: [delay]}, done)
    }
)

module.exports = async (deployer, network, accounts) => {

    const ensOwner = accounts[0]

    // Deploy ENS
    const currentBlock = await web3.eth.getBlock('latest')
    let currentBlockTime = currentBlock.timestamp

    const ens = await deployer.deploy(ENS)

    await deployer.deploy(HashRegistrar, ens.address, namehash.hash(ETH_TLD), currentBlockTime)
    await ens.setSubnodeOwner(ROOT_NODE, sha3(ETH_TLD), HashRegistrar.address)

    const baseRegistrar = await deployer.deploy(BaseRegistrar, ens.address, HashRegistrar.address, namehash.hash(ETH_TLD), currentBlockTime + 365 * DAYS)
    await ens.setSubnodeOwner(ROOT_NODE, sha3(ETH_TLD), BaseRegistrar.address)

    await deployer.deploy(SimplePriceOracle, DOMAIN_PRICE_PER_SECOND)

    const controller = await deployer.deploy(ETHRegistrarController, BaseRegistrar.address, SimplePriceOracle.address, MIN_COMMITMENT_PERIOD, MAX_COMMITMENT_PERIOD)

    await baseRegistrar.addController(controller.address)


    // Deploy ReverseRegistrar
    let resolver = await deployer.deploy(PublicResolver, ens.address)
    let reverseRegistrar = await deployer.deploy(ReverseRegistrar, ens.address, resolver.address)

    await ens.setSubnodeOwner(ROOT_NODE, sha3(REVERSE_TLD), ensOwner)
    await ens.setSubnodeOwner(namehash.hash(REVERSE_TLD), sha3(REVERSE_ADDR_DOMAIN), reverseRegistrar.address)


}