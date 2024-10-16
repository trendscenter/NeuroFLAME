import React from "react";
import { Button, Box, Typography } from "@mui/material";
import ComputationParametersDisplay from "./ComputationParametersDisplay";
import ComputationParametersEdit from "./ComputationParametersEdit";
import { useComputationParameters } from "./useComputationParameters";

interface ComputationParametersProps {
    computationParameters: string;
}

const ComputationParameters: React.FC<ComputationParametersProps> = ({ computationParameters }) => {
    const { isEditing, handleEdit, handleSave, handleCancel, isLeader } = useComputationParameters(computationParameters);

    return (
<<<<<<< HEAD
        <Box p={2} border={1} borderRadius={4} borderColor="grey.300">
            <Typography variant="h6" gutterBottom>
                Computation Parameters
=======
        <Box p={2} border={1} borderRadius={2} borderColor="grey.300" marginBottom={0} bgcolor={'white'}>
            <Typography variant="h6" gutterBottom>
                Settings <span style={{fontSize: '12px', color: 'black'}}>(parameters.json)</span>
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
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
            {!isEditing && isLeader && (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleEdit}
<<<<<<< HEAD
                    sx={{ mt: 2 }}
=======
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
                >
                    Edit
                </Button>
            )}
        </Box>
    );
};

export default ComputationParameters;
