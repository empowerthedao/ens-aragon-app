
const setAgent = (api, address) => {
    api.setAgent(address)
        .subscribe()
}

const setReverseRecord = (api, domainName) => {
    api.setReverseRecord(domainName)
        .subscribe()
}

export {
    setAgent,
    setReverseRecord
}