import AgentAbi from '../abi/agent-abi'
import EnsAbi from '../abi/ens-abi'
import PublicResolverAbi from '../abi/public-resolver-abi'
import {map} from 'rxjs/operators'

const agentAddress$ = api => api.call('agent')

const ensAddress$ = api => api.call('ens')

const agentApp$ = (api) =>
    agentAddress$(api).pipe(
        map(agentAddress => api.external(agentAddress, AgentAbi)))

const ens$ = api =>
    ensAddress$(api).pipe(
        map(ensAddress => api.external(ensAddress, EnsAbi)))

const publicResolver = (api, address) => api.external(address, PublicResolverAbi)

export {
    agentAddress$,
    ensAddress$,
    agentApp$,
    ens$,
    publicResolver
}