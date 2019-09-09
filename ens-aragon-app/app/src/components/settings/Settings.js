import React from "react"
import styled from 'styled-components'
import {Box, Button, IdentityBadge, Text, Info} from "@aragon/ui";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const Settings = ({handleNewAgent, handleNewEns, settings, compactMode}) => {
    let {agentAddress, ensAddress} = settings

    return (
        <div css={`display: flex;
                flex-direction: ${compactMode ? "column" : "row"};
                justify-content: space-between;
                align-items: flex-start;
                margin: 0px -10px;
                flex-wrap: wrap;
               `}
        >

            <div css={`
             flex-basis: 0;
             flex-grow: 1; 
             margin: 0px 10px;
             margin-bottom: 20px;
             ${compactMode && "width: 100%; padding-right: 20px;"}
             `}>
                <Box heading={"ENS Address"}>
                    <div css={`display: flex; flex-direction: column;`}>
                        <Text>
                            The contract that stores the owners and resolvers of ENS domains.
                        </Text>

                        <MarginTopContainer>
                            <IdentityBadge
                                entity={ensAddress || ZERO_ADDRESS}
                                shorten={compactMode}
                            />
                        </MarginTopContainer>


                        <ButtonContainer>
                            <Button mode="outline" onClick={() => handleNewEns()}>
                                Change ENS
                            </Button>
                        </ButtonContainer>
                    </div>
                </Box>
            </div>

            <div css={`
            flex-basis: 0; 
            flex-grow: 1; 
            margin: 0px 10px; 
            margin-bottom: 20px;
            ${compactMode && "width: 100%; padding-right: 20px;"}

            `}>
                <Box heading={"Agent Address"} css={`flex-basis: 50%;`}>

                    <div css={`display: flex; flex-direction: column;`}>
                        <Text>
                            The contract that represents an EOA (Externally Owned Account) and acts on behalf of the
                            Compound app.
                        </Text>

                        <MarginTopContainer>
                            <IdentityBadge
                                entity={agentAddress || ZERO_ADDRESS}
                                shorten={compactMode}
                            />
                        </MarginTopContainer>

                        <MarginTopContainer>
                            <Info>
                                <strong>
                                    Only send ERC20 tokens to this address via the transfer process provided.
                                </strong>
                            </Info>
                        </MarginTopContainer>

                        <ButtonContainer>
                            <Button mode="normal" onClick={() => handleNewAgent()}>
                                Change Agent
                            </Button>
                        </ButtonContainer>
                    </div>
                </Box>
            </div>

        </div>
    )
}

const ButtonContainer = styled.div`
    margin-top: 25px;
    display: flex;
`

const MarginTopContainer = styled.div`
    margin-top: 20px;
`

export default Settings