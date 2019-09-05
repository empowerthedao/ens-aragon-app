import {setAgent} from "../web3/EnsContract";
import {useApi, useAppState} from "@aragon/api-react";
import {useCallback} from 'react'
import {useSidePanel} from "./side-panels";
import {useTabs} from "./tabs";
import {useEns} from "./ens";

const useSetAgentAddress = (onDone) => {
    const api = useApi()

    return useCallback(address => {
        setAgent(api, address)
        onDone()
    }, [api, onDone])
}

export function useAppLogic() {

    const {
        isSyncing,
        agentAddress,
    } = useAppState()

    const ensState = useEns()
    const settings = {agentAddress}

    const sidePanel = useSidePanel()
    const tabs = useTabs()

    const actions = {
        setAgentAddress: useSetAgentAddress(sidePanel.requestClose),
    }

    return {
        isSyncing,
        settings,
        actions,
        sidePanel,
        tabs,
        ensState
    }
}