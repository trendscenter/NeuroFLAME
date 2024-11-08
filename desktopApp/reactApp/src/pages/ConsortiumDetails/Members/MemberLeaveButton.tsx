import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCentralApi } from "../../../apis/centralApi/centralApi";
import { Button, Typography, CircularProgress } from "@mui/material";

interface MemberLeadButtonProps {
    consortiumId: string;
}

const MemberLeaveButton: React.FC<MemberLeadButtonProps> = ({ consortiumId }) => {
    const { consortiumLeave } = useCentralApi();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [runId, setRunId] = useState<string | null>(null);
    const [runStarted, setRunStarted] = useState<boolean>(false);
    const navigate = useNavigate();

     // Handle leaving the consortium
     const handleLeave = async () => {
        setLoading(true);
        try {
            await consortiumLeave({ consortiumId: consortiumId });
            // You can refetch or update the UI state to reflect the change
        } catch (error) {
            console.error("Failed to leave the consortium:", error);
        } finally {
            setLoading(false);
            navigate('/consortiumList');
        }
    };

    return (
        <>
            {loading ? (
                <CircularProgress />
            ) : (
                <Button
                    variant="outlined"
                    onClick={handleLeave}
                    disabled={runStarted} // Disable after a run is started
                    size="small"
                    fullWidth
                >
                   Leave Consortium
                </Button>
            )}

            {error && (
                <Typography mt={2} color="error">
                    {error}
                </Typography>
            )}
        </>
    );
}

export default MemberLeaveButton;
