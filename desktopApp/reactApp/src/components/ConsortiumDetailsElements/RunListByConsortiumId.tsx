import { gql, useLazyQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from 'react';
import { ApolloClientsContext } from '../../contexts/ApolloClientsContext';
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

export default function RunListByConsortiumId(props: any) {
    const { centralApiApolloClient } = useContext(ApolloClientsContext);

    const [getRunList, { loading, error, data }] = useLazyQuery(GET_RUN_LIST, {
        client: centralApiApolloClient,
    });

    const [runs, setRuns] = useState(null);

    useEffect(() => {
        handleGetRunListByConsortiumId(props);
    }, [data]);

    const handleGetRunListByConsortiumId = (props) => {
        const consortiumId = props.consortiumId;
        getRunList({ variables: { consortiumId } });
        setRuns(data?.getRunList);
    };

    return (
        <div>
            {runs && runs.length > 0  && <div style={styles.container}>
                <h3 style={styles.h3}>Runs</h3>
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
                                fontSize: '1rem'
                            }}
                        >   <div>
                                <h4 style={{marginBottom: '0'}}><Link to={`/runs/details/${run.runId}`}>{run.runId}</Link></h4>
                                <span style={{whiteSpace: 'nowrap'}}><b>Date: </b>{new Date(Number(run.lastUpdated)).toLocaleString()}</span><br/>
                                <span style={{whiteSpace: 'nowrap'}}><b>Status: </b><span style={{color: '#2FB600'}}>{run.status}</span></span>
                            </div>
                            {run.status === 'Complete' &&
                                <Link 
                                    to={`/runs/results/${run.consortiumId}/${run.runId}`}
                                >
                                    <button style={styles.buttonSmall}>View Results</button>
                                </Link>
                            }
                        </Card>
                    ))
                    }
                </div >
            </div>}
        </div>
    );
};