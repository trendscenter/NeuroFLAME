import React, { useContext } from "react";
import { gql, useQuery } from '@apollo/client';
import { ApolloClientsContext } from "../contexts/ApolloClientsContext";
import ComputationsListItem from "./ComputationsListItem"; // Make sure to define this component

const GET_COMPUTATIONS = gql`
    query getComputationList {
        getComputationList {
            id
            title
            imageName
        }
    }
`;

export default function ComputationList() {
    const { centralApiApolloClient, edgeClientApolloClient } = useContext(ApolloClientsContext)
    const { loading, error, data, refetch } = useQuery(GET_COMPUTATIONS, { client: centralApiApolloClient });

    return (
        <div>
            {/* <button onClick={() => { refetch() }}>Get Computations</button> */}
            <h1>Computations</h1>
            {data && data.getComputationList.map((computation) => {
                return <ComputationsListItem key={computation.id} computation={computation} />
            })}
            {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
        </div>
    );
}
