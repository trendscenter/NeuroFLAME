import React, { useState } from "react";
<<<<<<< HEAD
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCentralApi } from "../../../apis/centralApi/centralApi";
import { Button, Typography, CircularProgress, Box } from "@mui/material";
=======
import { useNavigate, useParams } from "react-router-dom";
import { useCentralApi } from "../../../apis/centralApi/centralApi";
import { Button, Typography, CircularProgress } from "@mui/material";
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)

export default function StartRunButton() {
    const { startRun } = useCentralApi();
    const consortiumId = useParams<{ consortiumId: string }>().consortiumId as string;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [runId, setRunId] = useState<string | null>(null);
<<<<<<< HEAD
=======
    const [runStarted, setRunStarted] = useState<boolean>(false);
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
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
<<<<<<< HEAD
=======
            setRunStarted(true);
            const startRunTimeout = setTimeout(() => {
                setRunStarted(false);
            }, 10000);
            return () => clearTimeout(startRunTimeout);
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
        }
    };

    return (
<<<<<<< HEAD
        <Box p={2} border={1} borderRadius={4} borderColor="grey.300">
=======
        <>
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
            {loading ? (
                <CircularProgress />
            ) : (
                <Button
                    variant="contained"
<<<<<<< HEAD
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

=======
                    onClick={handleStartRun}
                    disabled={runStarted} // Disable after a run is started
                    sx={{
                        marginBottom: '1rem', 
                        backgroundColor: '#2FB600',
                        borderRadius: '1.2rem'
                    }}
                    fullWidth
                >
                    {runStarted ? `Run Started (ID: ${runId})` : "Start Run"}
                </Button>
            )}

>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
            {error && (
                <Typography mt={2} color="error">
                    {error}
                </Typography>
            )}
<<<<<<< HEAD
        </Box>
=======
        </>
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
    );
}
