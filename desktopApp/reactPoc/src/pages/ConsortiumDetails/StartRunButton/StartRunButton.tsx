import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCentralApi } from "../../../apis/centralApi/centralApi";
import { Button, Typography, CircularProgress, Box } from "@mui/material";

export default function StartRunButton() {
    const { startRun } = useCentralApi();
    const consortiumId = useParams<{ consortiumId: string }>().consortiumId as string;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [runId, setRunId] = useState<string | null>(null);

    const handleStartRun = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await startRun({ input: { consortiumId } });
            setRunId(result.runId);
        } catch (error) {
            setError("Failed to start the run. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={2} border={1} borderRadius={4} borderColor="grey.300">
            <Button
                variant="contained"
                color="primary"
                onClick={handleStartRun}
                disabled={!!runId} // Disable after successful run
            >
                {runId ? `Run Started (ID: ${runId})` : "Start Run"}
            </Button>
            {runId && (
                <Typography color="primary" mt={2}>
                    Run successfully started with ID: {runId}
                </Typography>
            )}
        </Box>
    );
}
