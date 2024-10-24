import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCentralApi } from "../../../apis/centralApi/centralApi";
import { Button, Typography, CircularProgress, Box } from "@mui/material";

export default function StartRunButton() {
    const { startRun } = useCentralApi();
    const consortiumId = useParams<{ consortiumId: string }>().consortiumId as string;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [runId, setRunId] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleStartRun = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await startRun({ input: { consortiumId } });
            setRunId(result.runId);
        } catch (err) {
            setError("Failed to start the run. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={2} borderRadius={4} >
            {loading ? (
                <CircularProgress />
            ) : (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStartRun}
                    disabled={!!runId} // Disable after a run is started
                    // fullWidth
                >
                    {runId ? `Run Started (ID: ${runId})` : "Start Run"}
                </Button>
            )}

            {runId && (
                <Typography mt={2} color="primary">
                    Run successfully started with ID: {runId}.{" "}
                    <Link to={`/run/details/${runId}`}>View Run</Link>
                </Typography>
            )}

            {error && (
                <Typography mt={2} color="error">
                    {error}
                </Typography>
            )}
        </Box>
    );
}
