import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import { Typography, Button, Box, Card, Container } from '@mui/material';
import { useCentralApi } from "../../apis/centralApi/centralApi";

export default function ConsortiumCreate() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const { consortiumCreate } = useCentralApi();

    const createConsortium = async () => {
        setLoading(true);
        try {
            const result = await consortiumCreate({ 
                title: title,
                description: description
            });

            if (result) {
                navigate('/consortium/details/'+result)
            } else {
                setError("Failed to create consortium");
            }
        } catch (error) {
            console.error("Failed to join the consortium:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box marginTop={4} marginBottom={2}>
                <Box display="flex" flexDirection="row" justifyContent="space-between" marginBottom={2}>
                    <Typography variant="h4" align="left">
                        Create New Consortium 
                    </Typography>
                    <Button variant="outlined" onClick={() => navigate('/consortium/list')}>
                        Back to Consortium List
                    </Button>
                </Box>
                <Box style={{background: 'white', padding: '1rem'}}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{width: "calc(100% - 2rem)", marginBottom: '1rem'}} 
                    />
                    <TextareaAutosize 
                        minRows={3} 
                        style={{width: "calc(100% - 2rem)", marginBottom: '0.5rem'}}
                        placeholder="Description"
                        defaultValue={description} 
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Button variant="contained" onClick={createConsortium} disabled={loading}>
                        {loading ? 'Creating...' : 'Create'}
                    </Button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>Consortium created successfully!</p>}
                </Box>
            </Box>
        </Container>
    );
}
