import { gql } from '@apollo/client';
import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { ApolloClientsContext } from '../contexts/ApolloClientsContext';
import { Link } from 'react-router-dom';

export const GET_RUN_LIST = gql`
  query GetRunList {
    getRunList {
      consortiumId
      consortiumTitle
      runId
      status
      lastUpdated
    }
  }
`;

interface RunListItem {
    consortiumId: string;
    consortiumTitle: string;
    runId: string;
    status: string;
    lastUpdated: string;
}

const RunList: React.FC = () => {
    const { centralApiApolloClient } = useContext(ApolloClientsContext);

    const { loading, error, data } = useQuery<{ getRunList: RunListItem[] }>(
        GET_RUN_LIST,
        { client: centralApiApolloClient }
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Run List</h1>
            {data?.getRunList.map((run) => (
                <div key={run.runId}>
                    <h2>{run.consortiumTitle}</h2>

                    <h3>RunId:   <Link to={`/runs/details/${run.runId}`}>{run.runId}    </Link></h3>

                    <p>Status: {run.status}</p>
                    <p>Last Updated: {new Date(Number(run.lastUpdated)).toLocaleString()}</p>
                </div>
            ))
            }
        </div >
    );
};

export default RunList;
