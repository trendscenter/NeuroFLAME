import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from 'axios';
import styles from './styles';

export default function RunResults() {
    const { consortiumId, runId } = useParams<{ consortiumId: string, runId: string }>();
    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [frameSrc, setFrameSrc] = useState<string | null>(null)
    const [edgeClientRunResultsUrl, setEdgeClientRunResultsUrl] = useState<string | null>(null);
    const [filesPanelWidth, setFilesPanelWidth] = useState<string | null>('15%')
    const [filesPanelShow, setFilesPanelShow] = useState<string | null>('inline')
    const [iframePanelWidth, setIframePanelWidth] = useState<string | null>('85%')
    const [arrowForwardShow, setArrowForwardShow] = useState<string | null>('none')

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
                const indexFile = response.data.find(({ name }) => name === "index.html");
                if(indexFile){
                    const initialSrc = `${edgeClientRunResultsUrl}/${indexFile.url}?x-access-token=${localStorage.getItem('accessToken')}`;
                    setFrameSrc(initialSrc);
                }
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

    const handleHideFiles = () => {
        setFilesPanelWidth('2%');
        setFilesPanelShow('none');
        setIframePanelWidth('98%');
        setArrowForwardShow('inline');
    }

    const handleShowFiles = () => {
        setFilesPanelWidth('15%');
        setFilesPanelShow('inline');
        setIframePanelWidth('85%');
        setArrowForwardShow('none');         
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

     
    return (
        <div>
            <div>
                <div style={styles.labelBetween}>
                    <h1>Output for Run: <span style={{color: 'black'}}>{runId}</span></h1>
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
                        <button>View Consortium</button>
                    </Link>
                    </div>
                </div>
            </div>
            <div style={styles.labelBetween}>
                <div style={{width: filesPanelWidth, transition: 'width 0.5s'}}>
                    <div style={{display: filesPanelShow}}>
                        <div style={styles.labelBetween}>
                            <h3>Files: </h3>
                            <a onClick={handleHideFiles} style={{padding: '0 0 0 0.5rem'}}><ArrowBackIosIcon /></a>
                        </div>
                        <ul style={{marginLeft: '1rem'}}>
                        {fileList.map((file, index) => (
                            <li>
                            <a href="#" onClick={() => setFrameSrc(`${edgeClientRunResultsUrl}/${file.url}?x-access-token=${localStorage.getItem('accessToken')}`)}
                            >{file.name}</a>
                            </li>
                        ))}  
                        </ul>  
                    </div>  
                    <a onClick={handleShowFiles} style={{position: 'relative', display: arrowForwardShow}}>
                    <ArrowForwardIosIcon /> 
                    <h3 style={{position: 'absolute',rotate: '90deg',top: '4rem', left:'-2.3rem'}}>Show Files</h3>
                    </a>        
                </div>
                <div style={{width: iframePanelWidth, transition: 'width 0.5s'}}>
                    {frameSrc ? <iframe
                    // put the token in the URL to authenticate the request
                        src={frameSrc}
                        title={`Run Result`}
                        width="100%"
                        height="100%"
                        sandbox="allow-same-origin"
                        style={{border: 'none', background: 'white', height: 'calc(100vh - 225px)'}}
                    /> : 
                    <div style={{background: 'white', height: 'calc(100vh - 225px)', padding: '1rem'}}>
                        <h2>No index.html file in the output folder.</h2>
                        <p>You're welcome to view the files on the left.</p>
                    </div>}
                </div>
            </div>
        </div>
    );
}
