import React from "react"
import styled from 'styled-components'
import {Box, Button, IdentityBadge, Info, Text} from "@aragon/ui";

const Ens = ({ensState}) => {

    const {agentReverseRecord} = ensState

    return (
        <div>
            <Box heading={"Agent Reverse Record"}>

                <div css={`display: flex; flex-direction: column;`}>

                    <Text size="large" weight="bold">
                        {agentReverseRecord || ". . ."}
                    </Text>

                    <Info css={`margin-top: 20px;`}>
                        <strong>
                            The reverse record is used to find an ENS domain associated with a particular address,
                            in this case the Agent's address.
                        </strong>
                    </Info>

                </div>

            </Box>

        </div>

    )
}

export default Ens
