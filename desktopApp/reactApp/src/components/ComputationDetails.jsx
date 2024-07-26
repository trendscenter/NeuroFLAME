import React, { useContext, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { useApolloClients } from "../contexts/ApolloClientsContext";

const GET_COMPUTATION_DETAILS = gql`
  query GetComputationDetails($computationId: String!) {
    getComputationDetails(computationId: $computationId) {
      title
      imageName
      imageDownloadUrl
      notes
      owner
    }
  }
`;

export default function ComputationDetails() {
    const { computationId } = useParams();
    const { centralApiApolloClient, edgeClientApolloClient } = useApolloClients();
    const { loading, error, data, refetch } = useQuery(GET_COMPUTATION_DETAILS, {
        variables: { computationId },
        client: centralApiApolloClient
    });

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: Please try again</p>}
            {data && <ComputationDetailContent details={data.getComputationDetails} />}
        </div>
    );
}

function ComputationDetailContent({ details }) {
    const { title, notes, imageName, imageDownloadUrl } = details;
    return (
        <div>
            <h1>{title}</h1>
            <p>imageName: {imageName}</p>
            <p>imageDownloadUrl: {imageDownloadUrl}</p>
            <pre>
                {notes}
            </pre>
        </div>
    );
}
