import React from "react";
import { gql, useQuery } from '@apollo/client';
import ConsortiaListItem from "./ConsortiaListItem";

const GET_CONSORTIA = gql`
    query getConsortiaList {
        getConsortiaList {
            id
            title
            description
        }
    }
`;

export default function ConsortiaList() {
    const { loading, error, data, refetch } = useQuery(GET_CONSORTIA);

    return (
        <div>
            {/* <button onClick={() => { refetch() }}>Get Consortia</button> */}
            <h1>Consortia</h1>
            {data && data.getConsortiaList.map((consortium) => {
                return <ConsortiaListItem key={consortium.id} consortium={consortium} />
            })}
            {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
        </div>
    );
}