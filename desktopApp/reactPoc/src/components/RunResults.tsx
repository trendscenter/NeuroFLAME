import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export function RunResults() {
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
            <h1>Run Results</h1>
            {fileList.map((file, index) => (
                <div key={index}>
                    <h2>{file.name}</h2>
                    <iframe
                        src={`${edgeClientRunResultsUrl}/${file.url}`} // Attach token as a query parameter
                        title={`Run Result ${index}`}
                        width="100%"
                        height="600px"
                        sandbox="allow-same-origin"
                    />
                </div>
            ))}
        </div>
    );
}
