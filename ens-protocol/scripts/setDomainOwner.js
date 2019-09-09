const ENS = artifacts.require('ENSRegistry')
const HashRegistrar = artifacts.require('HashRegistrar')
const ETHRegistrarController = artifacts.require('./ETHRegistrarController')
const ReverseRegistrar = artifacts.require('ReverseRegistrar')
const PublicResolver = artifacts.require('PublicResolver')

const namehash = require('eth-ens-namehash')
const Promise = require('bluebird')

const ETH_TLD = 'eth'
const DAYS = 24 * 60 * 60
const DOMAIN_NAME = 'empowerthedao'
const SECRET = '0xABCD'
const DOMAIN_PRICE_PER_SECOND = 1

const REVERSE_TLD = 'reverse'
const REVERSE_ADDR_DOMAIN = 'addr'

const NEW_OWNER = '0x3bf37efD74354A29f9507D1A21329b773bB49F58'

const advanceTime = Promise.promisify(function(delay, done) {
        web3.currentProvider.send({
            jsonrpc: "2.0",
            "method": "evm_increaseTime",
            params: [delay]}, done)
    }
)

module.exports = async () => {

    try {
        const subDomainOwner = (await web3.eth.getAccounts())[1]

        const ens = await ENS.at(ENS.address)
        const hashRegistrar = await HashRegistrar.at(HashRegistrar.address)
        const controller = await ETHRegistrarController.at(ETHRegistrarController.address)

        // Register ENS name
        const currentBlockTime = (await web3.eth.getBlock('latest')).timestamp
        const domainAllowedTime = (await hashRegistrar.getAllowedTime(namehash.hash(DOMAIN_NAME))).toNumber()
        const domainAllowedIn = domainAllowedTime - currentBlockTime
        await advanceTime(domainAllowedIn)

        const commitment = await controller.makeCommitment(DOMAIN_NAME, subDomainOwner, SECRET)
        await controller.commit(commitment, {from: subDomainOwner})

        await advanceTime((await controller.minCommitmentAge()).toNumber())

        await controller.register(DOMAIN_NAME, subDomainOwner, 28 * DAYS, SECRET, {
            value: 28 * DAYS + DOMAIN_PRICE_PER_SECOND,
            from: subDomainOwner
        })

        const domainName = DOMAIN_NAME + '.' + ETH_TLD
        const domainNode = namehash.hash(domainName)
        console.log(`${domainName} owner: ${await ens.owner(domainNode)}\n`)

        // Transfer ownership
        await ens.setOwner(domainNode, NEW_OWNER, {from: subDomainOwner})
        console.log(`${domainName} new owner: ${await ens.owner(domainNode)}`)


        // Set reverse record
        // const reverseRecordExtension = REVERSE_ADDR_DOMAIN + '.' + REVERSE_TLD
        // const reverseRecordNode = namehash.hash(subDomainOwner.slice(2).toLowerCase() + '.' + reverseRecordExtension)
        // const reverseRegistrarAddress = await ens.owner(namehash.hash(reverseRecordExtension))
        // const reverseRegistrar = await ReverseRegistrar.at(reverseRegistrarAddress)
        //
        // await reverseRegistrar.setName(domainName, {from: subDomainOwner})
        //
        // const subDomainResolver = await PublicResolver.at(await ens.resolver(reverseRecordNode))
        //
        // console.log(`Reverse record for ${subDomainOwner} set to: ${await subDomainResolver.name(reverseRecordNode)}`)


    } catch (error) {
        console.log(error)
    }
    process.exit()
}