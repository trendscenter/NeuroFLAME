import { gql, useLazyQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from 'react';
import { ApolloClientsContext } from '../../contexts/ApolloClientsContext';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import styles from '../styles';

export const GET_RUN_LIST_BY_CONSORTIUM_ID = gql`
  query GetRunListByConsortiumId($consortiumId: String!) {
    getRunListByConsortiumId(consortiumId: $consortiumId) {
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

// Define custom styles
const customStyles = {
    h3: {
      marginBottom: '0.5rem'
    },
    button: {
      fontSize: '14px',
      padding: '10px 14px',
      marginLeft: '1rem'
    },
    container: {
      background: '#ffffff',
      borderRadius: '1rem',
      padding: '1rem',
      marginBottom: '1rem'
    },
    containerOverflow: {
      height: 'auto',
      maxHeight: '340px',
      overflowX: 'scroll'
    }
  };  

export default function RunListByConsortiumId(props: any) {
    const { centralApiApolloClient } = useContext(ApolloClientsContext);

    const [getRunListByConsortiumId, { loading, error, data }] = useLazyQuery(GET_RUN_LIST_BY_CONSORTIUM_ID, {
        client: centralApiApolloClient,
    });

    const [runs, setRuns] = useState<object | null>(null);

    useEffect(() => {
        handleGetRunListByConsortiumId(props);
    }, [data]);

    const handleGetRunListByConsortiumId = (props) => {
        const consortiumId = props.consortiumId;
        getRunListByConsortiumId({ variables: { consortiumId } });
        setRuns(data?.getRunListByConsortiumId);
    };

    return (
        <div>
            {runs && runs.length > 0  && <div style={customStyles.container}>
                <h3 style={customStyles.h3}>Runs</h3>
                <div style={customStyles.containerOverflow}>
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
                                    <button style={customStyles.button}>View Results</button>
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