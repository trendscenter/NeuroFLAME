import React, { useContext, useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { ApolloClientsContext } from '../contexts/ApolloClientsContext';
import Card from '@mui/material/Card';
import styles from './styles';

// types.ts
export interface IRunDetails {
    runId: string;
    consortiumId: string;
    consortiumTitle: string;
    status: string;
    lastUpdated: string;
    members: {
        id: string;
        username: string;
    }[];
    studyConfiguration: {
        consortiumLeaderNotes: string;
        computationParameters: string;
        computation: {
            title: string;
            imageName: string;
            imageDownloadUrl: string;
            notes: string;
            owner: string;
        };
    };
    runErrors: string[];
}

const GET_RUN_DETAILS = gql`
  query GetRunDetails($runId: String!) {
    getRunDetails(runId: $runId) {
      runId
      consortiumId
      consortiumTitle
      status
      lastUpdated
      members {
        id
        username
      }
      studyConfiguration {
        consortiumLeaderNotes
        computationParameters
        computation {
          title
          imageName
          imageDownloadUrl
          notes
          owner
        }
      }
        runErrors {
            user {
                id
                username
            }
            timestamp
            message
        }
    }
  }
`;

export default function RunDetails() {
    const { centralApiApolloClient } = useContext(ApolloClientsContext);
    const { runId } = useParams<{ runId: string }>();
    const [runDetails, setRunDetails] = useState<IRunDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getRunDetails();
    }, []);

    const getRunDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await centralApiApolloClient?.query<{ getRunDetails: IRunDetails }>({
                query: GET_RUN_DETAILS,
                variables: { runId },
            });
            setRunDetails(result?.data?.getRunDetails || null);
        } catch (err) {
            setError('Error fetching run details');
            console.error('Error fetching run details:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!runDetails) {
        return <p>No run details available</p>;
    }

    return (
        <div>
            <div style={styles.labelBetween}>
                <h1>Details for Run: <span style={{ color: 'black' }}>{runId}</span></h1>
                <div>
                    <Link
                        to={`/runs/results/${runDetails.consortiumId}/${runDetails.runId}`}
                        style={{ marginRight: '1rem' }}
                    >
                        <button>View Run Results</button>
                    </Link>
                    <Link
                        to={`/consortia/details/${runDetails.consortiumId}`}
                    >
                        <button>View Consortium</button>
                    </Link>
                </div>
            </div>

            <Card sx={styles.card}>
                <h2>Consortium</h2>
                <p><strong>Title:</strong> {runDetails.consortiumTitle}</p>
                <p><strong>ID:</strong> {runDetails.consortiumId}</p>
            </Card>

            <Card sx={styles.card}>
                <h2>Run Information</h2>
                <p><strong>ID:</strong> {runDetails.runId}</p>
                <p><strong>Status:</strong> {runDetails.status}</p>
                <p><strong>Last Updated:</strong> {new Date(Number(runDetails.lastUpdated)).toLocaleString()}</p>
                <p><strong>Run Errors:</strong></p>
                <ul>
                    {runDetails.runErrors.map((error) => (
                        <li key={error}>{JSON.stringify(error)}</li>
                    ))}
                </ul>
            </Card>

            <Card sx={styles.card}>
                <h2>Members</h2>
                <ul>
                    {runDetails.members.map((member) => (
                        <li key={member.id}>{member.username}</li>
                    ))}
                </ul>
            </Card>

            <Card sx={styles.card}>
                <h2>Study Configuration</h2>
                <div>
                    <p><strong>Consortium Leader Notes:</strong></p>
                    <pre>{runDetails.studyConfiguration.consortiumLeaderNotes}</pre>
                </div>
                <div>
                    <p><strong>Computation Parameters:</strong></p>
                    <pre>{runDetails.studyConfiguration.computationParameters}</pre>
                </div>
                <div>
                    <h3>Computation</h3>
                    <p><strong>Title:</strong> {runDetails.studyConfiguration.computation.title}</p>
                    <p><strong>Image Name:</strong> {runDetails.studyConfiguration.computation.imageName}</p>
                    <p><strong>Image Download URL:</strong> {runDetails.studyConfiguration.computation.imageDownloadUrl}</p>
                    <p><strong>Notes:</strong></p>
                    <pre>{runDetails.studyConfiguration.computation.notes}</pre>
                    <p><strong>Owner:</strong> {runDetails.studyConfiguration.computation.owner}</p>
                </div>
            </Card>
        </div>
    );
}
