import { Box, Paper, Typography, Button } from "@mui/material";
import { useLatestRun } from "./useLatestRun"; // Import the custom hook

export function LatestRunDisplay({ latestRun, loading, navigateToRunDetails }: ReturnType<typeof useLatestRun> & { navigateToRunDetails: (runId: string) => void }) {

    return (
        <Box p={2} borderRadius={4} >
            <Typography variant="h4" gutterBottom>
                Latest Run
            </Typography>

            {latestRun ? (
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        {latestRun.consortiumTitle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Run ID:</strong> {latestRun.runId}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Status:</strong> {latestRun.status}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Created At:</strong> {new Date(Number(latestRun.createdAt)).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        <strong>Last Updated:</strong> {new Date(Number(latestRun.lastUpdated)).toLocaleString()}
                    </Typography>

                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigateToRunDetails()}
                        >
                            View Run Details
                        </Button>
                    </Box>
                </Paper>
            ) : (
                <Typography>No runs found for this consortium.</Typography>
            )}
        </Box>
    );
}
