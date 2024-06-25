import React, { useContext } from "react";
import { gql, useQuery } from '@apollo/client';
import ConsortiaListItem from "./ConsortiaListItem";
import { ApolloClientsContext } from "../contexts/ApolloClientsContext";

const GET_CONSORTIA = gql`
    query getConsortiumList {
        getConsortiumList {
            id
            title
            description
        }
    }
`;

export default function ConsortiaList() {
    const { centralApiApolloClient, edgeClientApolloClient } = useContext(ApolloClientsContext)
    const { loading, error, data, refetch } = useQuery(GET_CONSORTIA, { client: centralApiApolloClient });

    return (
        <div>
            {/* <button onClick={() => { refetch() }}>Get Consortia</button> */}
            <h1>Consortia</h1>
            {data && data.getConsortiumList.map((consortium) => {
                // return <div>{JSON.stringify(consortium)}</div>
                return <ConsortiaListItem key={consortium.id} consortium={consortium} />
            })}
            {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
        </div>
    );
}