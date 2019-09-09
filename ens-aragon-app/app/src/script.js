import '@babel/polyfill'
import Aragon, {events} from '@aragon/api'
import retryEvery from "./lib/retry-every"
import {
    agentAddress$,
    agentApp$, ensAddress$
} from "./web3/ExternalContracts";
import {agentInitializationBlock$} from "./web3/AgentData";
import {reverseRecordForAgent$} from "./web3/EnsData";

const DEBUG_LOGS = true;
const debugLog = message => {
    if (DEBUG_LOGS) {
        console.debug(message)
    }
}

const api = new Aragon()

// Wait until we can get the agent address (demonstrating we are connected to the app) before initializing the store.
retryEvery(retry => {
    agentAddress$(api).subscribe(
        () => initialize(),
        error => {
            console.error(
                'Could not start background script execution due to the contract not loading the agent address:',
                error
            )
            retry()
        }
    )
})

async function initialize() {

    api.store(onNewEventCatchError, {
        init: initialState,
        externals: [
            {
                contract: await agentApp$(api).toPromise(),
                initializationBlock: await agentInitializationBlock$(api).toPromise()
            }
        ]
    })
}

const initialState = async (cachedInitState) => {
    try {
        return {
            ...cachedInitState,
            isSyncing: true,
            agentAddress: await agentAddress$(api).toPromise(),
            ensAddress: await ensAddress$(api).toPromise(),
            agentReverseRecord: await reverseRecordForAgent$(api).toPromise()
        }
    } catch (e) {
        console.error(`Script init error: ${error}`)
        return state
    }
}

const onNewEventCatchError = async (state, event) => {
    try {
        return await onNewEvent(state, event)
    } catch (error) {
        console.error(`Script event error: ${error}`)
    }
}
const onNewEvent = async (state, storeEvent) => {

    const {
        event: eventName,
        address: eventAddress,
    } = storeEvent

    // console.log("Store Event:")
    // console.log(storeEvent)

    // console.log("Current state:")
    // console.log(state)

    switch (eventName) {
        case events.SYNC_STATUS_SYNCING:
            debugLog("APP SYNCING")
            return {
                ...state,
                isSyncing: true
            }
        case events.SYNC_STATUS_SYNCED:
            debugLog("APP DONE SYNCING")
            return {
                ...state,
                isSyncing: false
            }
        case 'AppInitialized':
            debugLog("APP CONSTRUCTOR EVENT")
            api.identify(eventAddress)
            return {
                ...state,
                appAddress: eventAddress
            }
        case 'NewAgentSet':
            debugLog("NEW AGENT SET")
            return {
                ...state,
                agentAddress: await agentAddress$(api).toPromise(),
            }
        case 'NewEnsSet':
            debugLog("NEW ENS SET")
            return {
                ...state,
                ensAddress: await ensAddress$(api).toPromise(),
                agentReverseRecord: await reverseRecordForAgent$(api).toPromise()
            }
        case 'ReverseRecordSet':
            debugLog("REVERSE RECORD SET")
            return {
                ...state,
                agentReverseRecord: await reverseRecordForAgent$(api).toPromise()
            }
        default:
            return state
    }
}
