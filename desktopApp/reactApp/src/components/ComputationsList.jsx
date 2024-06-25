import React from "react";
import { gql, useQuery } from '@apollo/client';
import ComputationsListItem from "./ComputationsListItem"; // Make sure to define this component

const GET_COMPUTATIONS = gql`
    query getComputationsList {
        getComputationsList {
            id
            title
            description
        }
    }
`;

export default function ComputationList() {
    const { loading, error, data, refetch } = useQuery(GET_COMPUTATIONS);

    return (
        <div>
            {/* <button onClick={() => { refetch() }}>Get Computations</button> */}
            <h1>Computations</h1>
            {data && data.getComputationsList.map((computation) => {
                return <ComputationsListItem key={computation.id} computation={computation} />
            })}
            {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
        </div>
    );
}
