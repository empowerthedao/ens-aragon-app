import {setAgent, setEnsAddress, setReverseRecord} from "../web3/EnsContract";
import {useApi, useAppState} from "@aragon/api-react";
import {useCallback} from 'react'
import {useSidePanel} from "./side-panels";
import {useTabs} from "./tabs";
import {useEns} from "./ens";
import {useReverseRecordState} from "./reverse-record-panel";

const useSetAgentAddress = (onDone) => {
    const api = useApi()

    return useCallback(address => {
        setAgent(api, address)
        onDone()
    }, [api, onDone])
}

const useSetEnsAddress = (onDone) => {
    const api = useApi()

    return useCallback(address => {
        setEnsAddress(api, address)
        onDone()
    }, [api, onDone])
}

const useSetReverseRecord = (onDone) => {
    const api = useApi()

    return useCallback(domainName => {
        setReverseRecord(api, domainName)
        onDone()
    }, [api, onDone])
}

export function useAppLogic() {

    const {
        isSyncing,
        agentAddress,
        ensAddress,
    } = useAppState()

    const ensState = useEns()
    const settings = {agentAddress, ensAddress}

    const reverseRecordState = useReverseRecordState()

    const sidePanel = useSidePanel()
    const tabs = useTabs()

    const actions = {
        setAgentAddress: useSetAgentAddress(sidePanel.requestClose),
        setEnsAddress: useSetEnsAddress(sidePanel.requestClose),
        setReverseRecord: useSetReverseRecord(sidePanel.requestClose)
    }

    return {
        isSyncing,
        settings,
        actions,
        sidePanel,
        tabs,
        ensState,
        reverseRecordState
    }
}