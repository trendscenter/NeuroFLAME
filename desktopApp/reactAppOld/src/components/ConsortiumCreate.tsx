import { gql } from '@apollo/client';
import { ApolloClientsContext } from '../contexts/ApolloClientsContext';
import { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import Card from '@mui/material/Card';
import styles from './styles';

const CONSORTIUM_CREATE_MUTATION = gql`
  mutation ConsortiumCreate($title: String!, $description: String!) {
    consortiumCreate(title: $title, description: $description)
  }
`;

export default function ConsortiumCreate() {
    const { centralApiApolloClient } = useContext(ApolloClientsContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const createConsortium = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await centralApiApolloClient?.mutate({
                mutation: CONSORTIUM_CREATE_MUTATION,
                variables: { title, description }
            });

            if (result?.data?.consortiumCreate) {
                const consortiumId = result.data.consortiumCreate;
                navigate('/consortia/details/'+consortiumId)
                setSuccess(true);
            } else {
                setError("Failed to create consortium");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Create Consortium</h1>
            <Card sx={styles.card}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextareaAutosize 
                    minRows={3} 
                    style={{width: '100%'}} 
                    placeholder="Description"
                    defaultValue={description} 
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button onClick={createConsortium} disabled={loading}>
                    {loading ? 'Creating...' : 'Create'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>Consortium created successfully!</p>}
            </Card>
        </div>
    );
}
