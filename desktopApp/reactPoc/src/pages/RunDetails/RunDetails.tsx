import React from "react";
import { Typography, Paper, Box, Alert } from "@mui/material";
import { useRunDetails } from "./useRunDetails";

export function RunDetails() {
    const { runDetails, loading, error } = useRunDetails();

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
                <Paper elevation={3} sx={{ padding: 2, mt: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        Run Details
                    </Typography>
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

                    {/* Members */}
                    <Typography variant="h6" gutterBottom mt={2}>
                        Members
                    </Typography>
                    {runDetails.members.map((member) => (
                        <Typography key={member.id} variant="body2">
                            {member.username} (ID: {member.id})
                        </Typography>
                    ))}

                    {/* Errors */}
                    {runDetails.runErrors.length > 0 && (
                        <>
                            <Typography variant="h6" gutterBottom mt={2}>
                                Errors
                            </Typography>
                            {runDetails.runErrors.map((error, index) => (
                                <Typography key={index} variant="body2" color="error">
                                    {error.message} - {new Date(error.timestamp).toLocaleString()} (User: {error.user.username})
                                </Typography>
                            ))}
                        </>
                    )}

                    {/* Study Configuration */}
                    <Typography variant="h6" gutterBottom mt={2}>
                        Study Configuration
                    </Typography>
                    <Typography variant="body1">
                        <strong>Computation Title:</strong> {runDetails.studyConfiguration.computation.title}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Computation Parameters:</strong> {runDetails.studyConfiguration.computationParameters}
                    </Typography>
                    <Typography variant="body1">
                        <strong>Consortium Leader Notes:</strong> {runDetails.studyConfiguration.consortiumLeaderNotes}
                    </Typography>
                </Paper>
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
