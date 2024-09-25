import React from "react";
import { Button, Box, Typography } from "@mui/material";
import ComputationParametersDisplay from "./ComputationParametersDisplay";
import ComputationParametersEdit from "./ComputationParametersEdit";
import { useComputationParameters } from "./useComputationParameters";

interface ComputationParametersProps {
    computationParameters: string;
}

const ComputationParameters: React.FC<ComputationParametersProps> = ({ computationParameters }) => {
    const { isEditing, handleEdit, handleSave, handleCancel } = useComputationParameters(computationParameters);

    return (
        <Box p={2} border={1} borderRadius={4} borderColor="grey.300">
            <Typography variant="h6" gutterBottom>
                Computation Parameters
            </Typography>
            {isEditing ? (
                <ComputationParametersEdit
                    computationParameters={computationParameters}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            ) : (
                <ComputationParametersDisplay computationParameters={computationParameters} />
            )}
            {!isEditing && (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleEdit}
                    sx={{ mt: 2 }}
                >
                    Edit
                </Button>
            )}
        </Box>
    );
};

export default ComputationParameters;
