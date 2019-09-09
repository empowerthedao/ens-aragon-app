import React, {useState, useEffect} from 'react'
import {Info, Button, Field, TextInput, Text, theme} from '@aragon/ui'
import styled from 'styled-components'

const SetReverseRecord = ({handleSetReverseRecord, reverseRecordState}) => {

    const {isAgentOwnerOfDomain} = reverseRecordState

    const [domainName, setDomainName] = useState("")
    const [isAgentOwner, setIsAgentOwner] = useState(false)

    const handleSubmit = (event) => {
        event.preventDefault()
        handleSetReverseRecord(domainName)
    }

    useEffect(() => {

        isAgentOwnerOfDomain(domainName, setIsAgentOwner)
    }, [domainName])

    return (
        <div>

            <form onSubmit={handleSubmit}>
                <Container>

                    <FieldStyled label="Domain name">
                        <TextInput type="text"
                                   wide
                                   required
                                   onChange={event => setDomainName(event.target.value)}/>
                    </FieldStyled>

                    {domainName &&
                    <Text color={isAgentOwner ? String(theme.positive) : String(theme.negative)}
                          size="small"
                          weight="bold">
                        {isAgentOwner ? "The agent owns this domain" : "The agent does not own this domain"}
                    </Text>}

                    <ButtonStyled wide mode="strong"
                                  type="submit">
                        Set reverse record
                    </ButtonStyled>

                    <Info.Action title="ENS Action">
                        This action will set the reverse record for the agents address, allowing lookup of the Agent's
                        domain name using it's address. Setting the reverse record to a domain other than one it owns
                        will break typical usage of the reverse record for third parties.
                    </Info.Action>
                </Container>
            </form>

        </div>
    )
}

const Container = styled.div`
    display:flex;
    flex-direction: column;
    margin-top: 30px;
`
const FieldStyled = styled(Field)`
    margin-bottom: 10px;
`
const ButtonStyled = styled(Button)`
    margin-top: 10px;
    margin-bottom: 30px;
`

export {
    SetReverseRecord
}