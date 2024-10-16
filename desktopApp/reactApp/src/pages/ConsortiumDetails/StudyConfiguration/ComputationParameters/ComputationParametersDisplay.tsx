import React from "react";
import { Typography, Paper } from "@mui/material";

interface ComputationParametersDisplayProps {
    computationParameters: string;
}

export default function ComputationParametersDisplay({ computationParameters }: ComputationParametersDisplayProps) {
    let formattedJson: string;

    try {
        // Parse and format the JSON for better readability
        const jsonObject = JSON.parse(computationParameters);
        formattedJson = JSON.stringify(jsonObject, null, 2); // Pretty-print JSON
    } catch (error) {
        formattedJson = "Invalid JSON format";
    }

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                Computation Parameters Display
            </Typography>
            <Paper elevation={3} style={{ padding: "16px", backgroundColor: "#f5f5f5" }}>
                <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                    {formattedJson}
                </pre>
            </Paper>
        </div>
    );
}
