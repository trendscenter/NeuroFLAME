import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Card, Container, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useComputationDetails } from "./useComputationDetails";
import ReactMarkdown from 'react-markdown';

export default function ComputationDetails() {
    const navigate = useNavigate();

    const { computationDetails, loading, error } = useComputationDetails();

    console.log(computationDetails);
    return (
        <Box p={2}>
            {/* Error State */}
            {error && (
                <Box mt={2}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}

            {/* Run Details Display */}
            {computationDetails && (
                <Container maxWidth="lg" sx={{marginTop: '1rem'}}>
                    <Box display="flex" justifyContent="space-between" marginLeft="1rem" marginRight="1rem">
                        <Typography variant="h4">
                            Computation Details
                        </Typography>
                        <Box>
                            <Button 
                                variant="outlined" 
                                onClick={() => navigate(`/computationList/`)}
                            >
                                Back To Computation List
                            </Button>
                        </Box>
                    </Box>
                    <Card style={{margin: '1rem', padding: '2rem'}}>
                        <Typography variant="h5" fontWeight="600" color="black">{computationDetails.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                            {computationDetails.imageName}
                        </Typography>
                        <Box marginTop="1rem">
                            <ReactMarkdown>{computationDetails.notes}</ReactMarkdown>
                        </Box>                       
                    </Card>
                </Container>
            )}

            {/* Fallback in case data is undefined and not loading */}
            {!loading && !computationDetails && !error && (
                <Typography variant="body1" color="textSecondary">
                    No run details available.
                </Typography>
            )}
        </Box>
    );
}
