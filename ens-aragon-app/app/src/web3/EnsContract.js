
const setAgent = (api, address) => {
    api.setAgent(address)
        .subscribe()
}

const setEnsAddress = (api, address) => {
    api.setEns(address)
        .subscribe()
}

const setReverseRecord = (api, domainName) => {
    api.setReverseRecord(domainName)
        .subscribe()
}

export {
    setAgent,
    setEnsAddress,
    setReverseRecord
}