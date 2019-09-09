import {useCallback} from 'react'
import {useApi} from "@aragon/api-react";
import namehash from 'eth-ens-namehash'
import {ownerOfNode$} from "../web3/EnsData";
import {zip} from 'rxjs'
import {map} from "rxjs/operators"
import {agentAddress$} from "../web3/ExternalContracts";

const useIsAgentOwnerOfDomain = () => {

    const api = useApi()

    return useCallback((domain, ownerOfDomainCallback) => {

        let node

        try {
            node = namehash.hash(domain)
        } catch (error) {
            return
        }

        zip(ownerOfNode$(api, node), agentAddress$(api)).pipe(
            map(([domainOwner, agentAddress]) => domainOwner === agentAddress)
        ).subscribe(isAgentDomainOwner => ownerOfDomainCallback(isAgentDomainOwner))
    }, [api])
}

export function useReverseRecordState() {

    return {
        isAgentOwnerOfDomain: useIsAgentOwnerOfDomain()
    }
}