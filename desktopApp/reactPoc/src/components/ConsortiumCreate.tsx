import { gql } from '@apollo/client';
import { ApolloClientsContext } from '../contexts/ApolloClientsContext';
import { useContext, useState } from 'react';

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
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={createConsortium} disabled={loading}>
                {loading ? 'Creating...' : 'Create'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>Consortium created successfully!</p>}
        </div>
    );
}
