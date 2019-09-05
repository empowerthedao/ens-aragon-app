
const setAgent = (api, address) => {
    api.setAgent(address)
        .subscribe()
}

const setReverseRecord = (api, damainName) => {
    console.log("SET REVESER RECORD")
}

export {
    setAgent,
    setReverseRecord
}