import { gql } from '@apollo/client';
import React from 'react';
import { useQuery } from '@apollo/client';
import { useApolloClients } from '../contexts/ApolloClientsContext';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import styles from './styles';

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
    const { centralApiApolloClient } = useApolloClients();

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
                <Card
                    key={run.runId}
                    sx={styles.card}
                >
                    <p>
                       Run Id: <Link to={`/runs/details/${run.runId}`}>{run.runId}</Link>
                    </p>
                    <p>
                        Consortium: <Link to={`/consortia/details/${run.consortiumId}`}>{run.consortiumTitle}</Link>
                    </p>
                    <p>Status: {run.status}</p>
                    <p>Last Updated: {new Date(Number(run.lastUpdated)).toLocaleString()}</p>
                </Card>
            ))}
        </div>
    );
};

export default RunList;
