import React from 'react';
import { gql, useQuery } from '@apollo/client';
import {  useApolloClients } from '../../contexts/ApolloClientsContext';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import styles from '../styles';

export const GET_RUN_LIST = gql`
  query GetRunList($consortiumId: String!) {
    getRunList(consortiumId: $consortiumId) {
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

interface RunListByConsortiumIdProps {
    consortiumId: string;
}

const RunListByConsortiumId: React.FC<RunListByConsortiumIdProps> = ({ consortiumId }) => {
    const { centralApiApolloClient } = useApolloClients();

    const { loading, error, data } = useQuery<{ getRunList: RunListItem[] }>(GET_RUN_LIST, {
        variables: { consortiumId },
        client: centralApiApolloClient,
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const runs = data?.getRunList || [];

    return (
        <div>
            {runs.length > 0 && (
                <div style={styles.container}>
                    <h3 style={styles.h3}>
                        Runs <span style={{ color: 'black' }}>({runs.length})</span>
                    </h3>
                    <div style={styles.containerOverflow}>
                        {runs.map((run) => (
                            <Card
                                key={run.runId}
                                sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1rem',
                                    marginBottom: '1rem',
                                    backgroundColor: '#edf2f2',
                                    boxShadow: 'none',
                                    fontSize: '1rem',
                                }}
                            >
                                <div>
                                    <h4 style={{ marginBottom: '0' }}>
                                        <Link to={`/runs/details/${run.runId}`}>{run.runId}</Link>
                                    </h4>
                                    <span style={{ whiteSpace: 'nowrap' }}>
                                        <b>Date: </b>{new Date(Number(run.lastUpdated)).toLocaleString()}
                                    </span>
                                    <br />
                                    <span style={{ whiteSpace: 'nowrap' }}>
                                        <b>Status: </b><span style={{ color: '#2FB600' }}>{run.status}</span>
                                    </span>
                                </div>
                                {run.status === 'Complete' && (
                                    <Link to={`/runs/results/${run.consortiumId}/${run.runId}`}>
                                        <button style={styles.buttonSmall}>Results</button>
                                    </Link>
                                )}
                                {run.status === 'Ready' && (
                                    <Link to={`/runs/results/${run.consortiumId}/${run.runId}`}>
                                        <button style={styles.buttonSmall}>Run Output</button>
                                    </Link>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RunListByConsortiumId;
