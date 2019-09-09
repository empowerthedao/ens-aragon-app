import React from 'react'
import {
    SidePanel,
    SyncIndicator,
    useViewport,
    Button,
    Header,
    Tabs
} from '@aragon/ui'
import Settings from "./components/settings/Settings"
import GenericInputPanel from "./components/GenericInputPanel";
import {useAppLogic} from "./hooks/app-logic";
import SwapIcon from "./assets/swap-icon.svg"
import Ens from "./components/ens/Ens";
import {SetReverseRecord} from "./components/ens/side-input-panel/SetReverseRecord";

function App({compactMode}) {

    const {
        isSyncing,
        settings,
        actions,
        sidePanel,
        tabs,
        ensState,
        reverseRecordState
    } = useAppLogic()

    const selectedTabComponent = () => {
        switch (tabs.tabBarSelected.id) {
            case 'ENS':
                return <Ens compactMode={compactMode}
                            ensState={ensState}/>
            case 'SETTINGS':
                return <Settings settings={settings}
                                 handleNewAgent={() => sidePanel.openPanelActions.changeAgent()}
                                 handleNewEns={() => sidePanel.openPanelActions.changeEns()}
                                 compactMode={compactMode}/>
            default:
                return <div/>
        }
    }

    const currentSidePanel = () => {
        switch (sidePanel.currentSidePanel.id) {
            case 'CHANGE_AGENT':
                return <GenericInputPanel actionTitle={'ENS Action'}
                                          actionDescription={`This action will change the Agent which represents an Externally
                                        Owned Account (EOA) and is responsible for interacting with the Uniswap protocol.`}
                                          inputFieldList={[
                                              {id: 1, label: 'address', type: 'text'}]}
                                          submitLabel={'Change agent'}
                                          handleSubmit={actions.setAgentAddress}/>
            case 'CHANGE_ENS':
                return <GenericInputPanel actionTitle={'ENS Action'}
                                          actionDescription={`This action will change the ENS address which stores the 
                                          owners and resolvers of ENS domains.`}
                                          inputFieldList={[
                                              {id: 1, label: 'address', type: 'text'}]}
                                          submitLabel={'Change ENS'}
                                          handleSubmit={actions.setEnsAddress}/>
            case 'SET_REVERSE_RECORD':
                return <SetReverseRecord handleSetReverseRecord={actions.setReverseRecord} reverseRecordState={reverseRecordState}/>
            default:
                return <div/>
        }
    }

    return (
        <div css="min-width: 320px">
            <SyncIndicator visible={isSyncing}/>

            <Header
                primary="Ethereum Name Service"
                secondary={
                    tabs.tabBarSelected.id === 'ENS' &&
                    <Button
                        mode="strong"
                        onClick={() => sidePanel.openPanelActions.setReverseRecord()}
                        css={`${compactMode && `
                            min-width: 40px;
                            padding: 0;
                            `}
                        `}
                    >
                        {compactMode ? <img src={SwapIcon} height="30px" alt=""/> : 'Set Reverse Record'}
                    </Button>
                }
            />

            <Tabs
                items={tabs.names}
                selected={tabs.selected}
                onChange={tabs.selectTab}/>

            {selectedTabComponent()}

            <SidePanel
                title={sidePanel.currentSidePanel.title}
                opened={sidePanel.visible}
                onClose={sidePanel.requestClose}
                onTransitionEnd={sidePanel.endTransition}
            >
                {currentSidePanel()}
            </SidePanel>
        </div>
    )
}

export default () => {
    const {below} = useViewport()
    const compactMode = below('medium')

    return <App compactMode={compactMode}/>
}