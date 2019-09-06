import {useAppState} from "@aragon/api-react";

export function useEns() {

    const { agentReverseRecord } = useAppState()

    return {
        agentReverseRecord
    }
}