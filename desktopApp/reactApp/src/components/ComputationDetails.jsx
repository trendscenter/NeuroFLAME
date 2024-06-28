import React, { useContext } from "react";
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { ApolloClientsContext } from "../contexts/ApolloClientsContext";

const GET_COMPUTATION_DETAILS = gql`
  query getComputationDetails($computationId: String!) {
    getComputationDetails(computationId: $computationId) {
      id
      title
      description
      compSpec
    }
  }
`;

export default function ComputationDetails() {
    const { computationId } = useParams();
    const { centralApiApolloClient, edgeClientApolloClient } = useContext(ApolloClientsContext)
    const { loading, error, data, refetch } = useQuery(GET_COMPUTATION_DETAILS, {
        variables: { computationId },
    }, { client: centralApiApolloClient });

    return (
        <div>
            <div>{computationId}</div>
            {/* <button onClick={refetch}>refetch</button> */}
            {loading && <p>Loading...</p>}
            {error && <p>Error: Please try again</p>}
            {data && <ComputationDetailContent details={data.getComputationDetails} />}
        </div>
    );
}

function ComputationDetailContent({ details }) {
    return (
        <div>
            <h1>{details.title}</h1>
            <div>{details.description}</div>
            <pre>
                <code>
                    {JSON.stringify(JSON.parse(details.compSpec), null, 2)}
                </code>
            </pre>
        </div>
    );
}
