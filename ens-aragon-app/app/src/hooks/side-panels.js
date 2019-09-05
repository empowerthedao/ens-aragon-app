import React, {useState} from 'react'
import {useCallback} from 'react'

export function useSidePanel() {

    const defaultSidePanel = {id: "", title: ""}

    const [currentSidePanel, setCurrentSidePanel] = useState(defaultSidePanel)
    const [visible, setVisible] = useState(false)
    const [opened, setOpened] = useState(false)

    const sidePanels = {
        DEFAULT: defaultSidePanel,
        CHANGE_AGENT: {
            id: 'CHANGE_AGENT',
            title: 'Change the Agent'
        },
        SET_REVERSE_RECORD: {
            id: 'SET_REVERSE_RECORD',
            title: 'Set the reverse record'
        }
    }

    const requestOpen = useCallback((sidePanel) => {
        setCurrentSidePanel(sidePanel)
        setVisible(true)
    }, [setVisible, currentSidePanel])

    const endTransition = useCallback(
        opened => {
            if (opened) {
                setOpened(true)
            } else {
                setOpened(false)
                setCurrentSidePanel(sidePanels.DEFAULT)
            }
        },
        [setOpened, currentSidePanel]
    )

    const requestClose = useCallback(() => {
        setVisible(false)
    }, [setVisible])

    const openPanelActions = {
        changeAgent: () => requestOpen(sidePanels.CHANGE_AGENT),
        setReverseRecord: () => requestOpen(sidePanels.SET_REVERSE_RECORD)
    }

    return { currentSidePanel, opened, visible, openPanelActions, requestOpen, endTransition, requestClose }
}

