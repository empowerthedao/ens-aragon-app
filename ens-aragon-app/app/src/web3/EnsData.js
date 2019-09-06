import {agentAddress$, ens$, publicResolver} from "./ExternalContracts";
import namehash from 'eth-ens-namehash'
import {zip} from "rxjs";
import {mergeMap, map} from "rxjs/operators";

const REVERSE_RECORD_EXTENSION = 'addr.reverse'

const agentReverseRecordNode$ = (api) =>
    agentAddress$(api).pipe(
        map(agentAddress => namehash.hash(`${agentAddress.slice(2).toLowerCase()}.${REVERSE_RECORD_EXTENSION}`)))

const reverseRecordForAgent$ = (api) =>
    zip(ens$(api), agentReverseRecordNode$(api)).pipe(
        mergeMap(([ens, agentReverseRecordNode]) => ens.resolver(agentReverseRecordNode).pipe(
            map(resolverAddress => publicResolver(api, resolverAddress)),
            mergeMap(agentReverseRecordResolver => agentReverseRecordResolver.name(agentReverseRecordNode))
        ))
    )

export {
    agentReverseRecordNode$,
    reverseRecordForAgent$
}