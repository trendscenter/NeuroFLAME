import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useRunDetails } from "./useRunDetails";
import { MembersDisplay } from "./MembersDisplay";
import parse from 'html-react-parser';

export function RunDetails() {
    const navigate = useNavigate();

    const { runDetails, loading, error } = useRunDetails();

    const [formattedRunDetails, setFormattedRunDetails] = useState('');


    useEffect(() => {
        if(runDetails){
            setFormattedRunDetails(JSON.stringify(JSON.parse(runDetails.studyConfiguration.computationParameters),null, 2));
        }
    },
        [runDetails]
    )

    return (
        <Box p={2}>
            {/* Error State */}
            {error && (
                <Box mt={2}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}

            {/* Run Details Display */}
            {runDetails && (
                <Box>
                    <Box display="flex" justifyContent="space-between" marginLeft="1rem" marginRight="1rem">
                        <Typography variant="h4">
                            Run Details
                        </Typography>
                        <Box>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                style={{marginRight: '1rem'}}
                                onClick={() => navigate(`/consortium/details/${runDetails.consortiumId}`)}
                            >
                                View Consortium
                            </Button>
                            {runDetails.status === 'Complete' && <Button 
                                variant="contained" 
                                color="success"
                                onClick={() => navigate(`/run/results/${runDetails.consortiumId}/${runDetails.runId}`)}
                            >
                                View Run Results
                            </Button>}
                        </Box>
                    </Box>
                    <Grid container spacing={2} padding={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Box p={2} borderRadius={2} bgcolor={'white'}>
                                <Typography variant="body1">
                                    <strong>Consortium:</strong> {runDetails.consortiumTitle} ({runDetails.consortiumId})
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Status:</strong> {runDetails.status}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Created At:</strong> {new Date(+runDetails.createdAt).toLocaleString()}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Last Updated:</strong> {new Date(+runDetails.lastUpdated).toLocaleString()}
                                </Typography>
                            </Box>
                        </Grid>
                        {/* Members */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <MembersDisplay members={runDetails.members} />
                        </Grid>
                        {/* Errors */}
                        {runDetails.runErrors.length > 0 && (<Grid size={{ sm: 12}}>
                            <Box p={2} borderRadius={2}  marginBottom={0} bgcolor={'white'}>
                                <Typography variant="h6" gutterBottom>
                                    Errors
                                </Typography>
                                {runDetails.runErrors.map((error, index) => (
                                    <Typography key={index} variant="body2" color="error">
                                        {new Date(+error.timestamp).toLocaleString()} {error.user.username} - {error.message}
                                    </Typography>
                                ))}
                            </Box>
                        </Grid>)}
                        <Grid size={{sm: 12}}>
                            <Box p={2} borderRadius={2}  marginBottom={0} bgcolor={'white'}>
                                {/* Study Configuration */}
                                <Typography variant="h6" gutterBottom>
                                    Study Configuration
                                </Typography>
                                <Box marginBottom={1}>
                                <Typography variant="body1">
                                    <strong>Computation:</strong> {runDetails.studyConfiguration.computation.title}
                                </Typography>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6}}>
                                        <Typography variant="body1">
                                            <strong>Parameters:</strong> 
                                        </Typography>
                                        <Box marginTop={1}>
                                            <pre className="settings" style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                                                {formattedRunDetails ? formattedRunDetails : ''}
                                            </pre>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ sm: 6}}>
                                        <Typography variant="body1">
                                            <strong>Leader Notes:</strong> 
                                        </Typography>
                                        <Box marginTop={1}>
                                            <div style={{background: '#EEF2F2', padding: '1rem 1rem 0.5rem'}}>
                                                    {parse(runDetails.studyConfiguration.consortiumLeaderNotes)}
                                            </div>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>                    
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Fallback in case data is undefined and not loading */}
            {!loading && !runDetails && !error && (
                <Typography variant="body1" color="textSecondary">
                    No run details available.
                </Typography>
            )}
        </Box>
    );
}
