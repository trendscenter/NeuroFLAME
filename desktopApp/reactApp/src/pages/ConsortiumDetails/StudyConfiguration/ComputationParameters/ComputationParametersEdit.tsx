import React, { useState } from "react";
<<<<<<< HEAD
import { Button, TextField, Typography } from "@mui/material";
=======
import { Button, TextField } from "@mui/material";
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)

interface ComputationParametersEditProps {
    computationParameters: string;
    onSave: (newParameters: string) => void;
    onCancel: () => void;
}

export default function ComputationParametersEdit({
    computationParameters,
    onSave,
    onCancel,
}: ComputationParametersEditProps) {
    const [parameters, setParameters] = useState(computationParameters);
    const [isValidJson, setIsValidJson] = useState(true);

    const handleSave = () => {
        if (isValidJson) {
            onSave(parameters);
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setParameters(value);

        // Validate JSON
        try {
            JSON.parse(value);
            setIsValidJson(true);
        } catch (error) {
            setIsValidJson(false);
        }
    };

    return (
        <div>
<<<<<<< HEAD
            <Typography variant="h5" gutterBottom>
                Computation Parameters Edit
            </Typography>
=======
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
            <TextField
                fullWidth
                multiline
                rows={10}
                variant="outlined"
<<<<<<< HEAD
                label="Computation Parameters (JSON)"
=======
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
                value={parameters}
                onChange={handleChange}
                error={!isValidJson}
                helperText={!isValidJson ? "Invalid JSON format" : "Enter valid JSON"}
            />
            <div style={{ marginTop: "16px" }}>
                <Button
<<<<<<< HEAD
=======
                    size="small"
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={!isValidJson}
                    style={{ marginRight: "8px" }}
                >
                    Save
                </Button>
<<<<<<< HEAD
                <Button variant="outlined" onClick={handleCancel}>
=======
                <Button size="small" variant="outlined" onClick={handleCancel}>
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
                    Cancel
                </Button>
            </div>
        </div>
    );
}
