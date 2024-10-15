import { gql } from '@apollo/client';
import { ApolloClientsContext } from '../contexts/ApolloClientsContext';
import { useContext, useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './styles';

const COMPUTATION_CREATE_MUTATION = gql`
  mutation ComputationCreate($title: String!, $imageName: String!, $imageDownloadUrl: String!, $notes: String!) {
    computationCreate(title: $title, imageName: $imageName, imageDownloadUrl: $imageDownloadUrl, notes: $notes)
  }
`;

export default function ComputationCreate() {
    const { centralApiApolloClient } = useContext(ApolloClientsContext);
    const [title, setTitle] = useState('');
    const [imageName, setImageName] = useState('');
    const [imageDownloadUrl, setImageDownloadUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createComputation = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await centralApiApolloClient?.mutate({
                mutation: COMPUTATION_CREATE_MUTATION,
                variables: { title, imageName, imageDownloadUrl, notes }
            });

            if (result?.data?.computationCreate) {
                setSuccess(true);
            } else {
                setError("Failed to create computation");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Create Computation</h1>
            <Card sx={styles.card}>
                <div className="form-group">
                    <div>
                        <label>Title</label>
                    </div>
                    <input
                        style={{ width: '100%' }}
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <div>
                        <label>Image Name</label>
                    </div>
                    <input
                        style={{ width: '100%' }}
                        type="text"
                        placeholder="nvflare-algorithm-dataformat"
                        value={imageName}
                        onChange={(e) => setImageName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <div>
                        <label>Image Download URL</label>
                    </div>
                    <input
                        style={{ width: '100%' }}
                        type="text"
                        placeholder="https://hub.docker.com/repository/docker/username/imagename"
                        value={imageDownloadUrl}
                        onChange={(e) => setImageDownloadUrl(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <div>
                        <label>Notes</label>
                    </div>
                    <textarea
                        style={{ width: '100%' }}
                        placeholder="Notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={10} // Adjust the number of rows as needed to make the textarea larger
                    />
                </div> 
                <button onClick={createComputation} disabled={loading}>
                    {loading ? 'Creating...' : 'Create'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>Computation created successfully!</p>}
            </Card>
        </div>
    );
}
