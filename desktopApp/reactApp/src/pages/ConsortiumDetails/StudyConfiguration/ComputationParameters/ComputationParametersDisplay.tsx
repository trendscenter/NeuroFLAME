<<<<<<< HEAD
import React from "react";
import { Typography, Paper } from "@mui/material";

=======
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
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
<<<<<<< HEAD
            <Typography variant="h5" gutterBottom>
                Computation Parameters Display
            </Typography>
            <Paper elevation={3} style={{ padding: "16px", backgroundColor: "#f5f5f5" }}>
                <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                    {formattedJson}
                </pre>
            </Paper>
=======
            <pre className="settings" style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                {computationParameters ? 
                formattedJson : 
                'Please provide settings that coorespond to your selected Computation. Refer to Computation Notes for Example Settings.'}
            </pre>
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
        </div>
    );
}
