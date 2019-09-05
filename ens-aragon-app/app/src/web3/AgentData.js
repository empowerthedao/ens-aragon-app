import {mergeMap} from "rxjs/operators";
import {agentApp$} from "./ExternalContracts";

const agentInitializationBlock$ = (api) =>
    agentApp$(api).pipe(
        mergeMap(agent => agent.getInitializationBlock()))

export {
    agentInitializationBlock$,
}