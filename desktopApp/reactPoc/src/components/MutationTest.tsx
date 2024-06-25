import React, { useContext } from 'react';
import { ApolloClientsContext } from '../contexts/ApolloClientsContext';
import { gql } from '@apollo/client';

export default function MutationTest() {
    const ApolloClients = useContext(ApolloClientsContext)

    localStorage.setItem('accessToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjI4OWM3OWFlYmFiNjcwNDBhMjAwNjkiLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTcxMzkzODM5Mn0.7DwUKkNGOi7_rZ1qXDtZ_5ptN_4W1WSRf4mnI969Ktc')
    const startRun = () => {
        const { centralApiApolloClient } = ApolloClients;

        centralApiApolloClient?.mutate({
            mutation: gql`
            mutation StartRun($input: StartRunInput) {
                startRun(input: $input) {
                  runId
                }
              }
            `,
            variables: {
                "input": {
                    "consortiumId": "66289c79aecab67040a22001"
                }
            }
        });
    }

    return (
        <div>
            <h1>Mutation Test</h1>
            <button onClick={startRun}>Start Run</button>
        </div>
    );
}