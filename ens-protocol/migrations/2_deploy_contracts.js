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
const DOMAIN_NAME = 'empowerthedao'
const SECRET = '0xABCD'
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
    const subDomainOwner = accounts[1]


    // Deploy ENS
    const currentBlock = await web3.eth.getBlock('latest')
    let currentBlockTime = currentBlock.timestamp

    const ens = await deployer.deploy(ENS)

    const hashRegistrar = await deployer.deploy(HashRegistrar, ens.address, namehash.hash(ETH_TLD), currentBlockTime)
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


    // Register ENS name
    currentBlockTime = (await web3.eth.getBlock('latest')).timestamp
    const domainAllowedTime = (await hashRegistrar.getAllowedTime(namehash.hash(DOMAIN_NAME))).toNumber()
    const domainAllowedIn = domainAllowedTime - currentBlockTime

    await advanceTime(domainAllowedIn)

    const commitment = await controller.makeCommitment(DOMAIN_NAME, subDomainOwner, SECRET)
    await controller.commit(commitment, {from: subDomainOwner})

    await advanceTime((await controller.minCommitmentAge()).toNumber())

    await controller.register(DOMAIN_NAME, subDomainOwner, 28 * DAYS, SECRET, { value: 28 * DAYS + DOMAIN_PRICE_PER_SECOND, from: subDomainOwner})

    const domainName = DOMAIN_NAME + '.' + ETH_TLD
    console.log(`${domainName} owner: ${await ens.owner(namehash.hash(domainName))}\nexpected owner: ${subDomainOwner}`)


    // Set reverse record
    const reverseRecordExtension = REVERSE_ADDR_DOMAIN + '.' + REVERSE_TLD
    const reverseRegistrarNode = namehash.hash(subDomainOwner.slice(2).toLowerCase() + '.' + reverseRecordExtension)
    const reverseRegistrarAddress = await ens.owner(namehash.hash(reverseRecordExtension))
    reverseRegistrar = await ReverseRegistrar.at(reverseRegistrarAddress)

    await reverseRegistrar.setName(domainName, {from: subDomainOwner})

    const subDomainResolver = await PublicResolver.at(await ens.resolver(reverseRegistrarNode))

    console.log(`Reverse record: ${await subDomainResolver.name(reverseRegistrarNode)}`)
}