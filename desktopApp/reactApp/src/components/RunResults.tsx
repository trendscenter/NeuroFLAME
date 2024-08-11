import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './styles';

export default function RunResults() {
    const { consortiumId, runId } = useParams<{ consortiumId: string, runId: string }>();
    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [edgeClientRunResultsUrl, setEdgeClientRunResultsUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchEdgeClientRunResultsUrl = async () => {
            const { edgeClientRunResultsUrl } = await window.ElectronAPI.getConfig()
            setEdgeClientRunResultsUrl(edgeClientRunResultsUrl);
        };
        fetchEdgeClientRunResultsUrl();
    })

    useEffect(() => {
        if (!edgeClientRunResultsUrl) return;
        const fetchResultsFilesList = async () => {
            const accessToken = localStorage.getItem('accessToken');
            try {
                const response = await axios.get(`${edgeClientRunResultsUrl}/${consortiumId}/${runId}`, {
                    headers: {
                        'x-access-token': accessToken
                    }
                });
                setFileList(response.data);
            } catch (err) {
                setError('Failed to fetch results');
                console.error('Error fetching results:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchResultsFilesList();
    }, [consortiumId, runId, edgeClientRunResultsUrl]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

     
    return (
        <div>
            <div style={styles.labelBetween}>
                <h1>Results for Run: <span style={{color: 'black'}}>{runId}</span></h1>
                <div>
                <Link 
                    to={`/runs/details/${runId}`}
                    style={{marginRight: '1rem'}}
                >
                    <button>View Run Details</button>
                </Link>
                <Link 
                    to={`/consortia/details/${consortiumId}`}
                >
                    <button>Back To Consortium</button>
                </Link>
                </div>
            </div>
            {fileList.map((file, index) => (
                <div key={index}>
                    <iframe
                    // put the token in the URL to authenticate the request
                        src={`${edgeClientRunResultsUrl}/${file.url}?x-access-token=${localStorage.getItem('accessToken')}`}
                        title={`Run Result ${index}`}
                        width="100%"
                        height="600px"
                        sandbox="allow-same-origin"
                        style={{border: 'none', background: 'white'}}
                    />
                </div>
            ))}
        </div>
    );
}
