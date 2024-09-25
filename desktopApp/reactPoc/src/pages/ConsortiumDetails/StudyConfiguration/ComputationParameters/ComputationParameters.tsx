// src/components/ComputationParameters.tsx
import React from "react";
import ComputationParametersDisplay from "./ComputationParametersDisplay";
import ComputationParametersEdit from "./ComputationParametersEdit";
import { useComputationParameters } from "./useComputationParameters";

interface ComputationParametersProps {
    computationParameters: string;
}

const ComputationParameters: React.FC<ComputationParametersProps> = ({ computationParameters }) => {
    const { isEditing, handleEdit, handleSave, handleCancel } = useComputationParameters(computationParameters);

    return (
        <div>
            <h1>Computation Parameters</h1>
            {isEditing ? (
                <ComputationParametersEdit
                    computationParameters={computationParameters}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            ) : (
                <ComputationParametersDisplay computationParameters={computationParameters} />
            )}
            {!isEditing && <button onClick={handleEdit}>Edit</button>}
        </div>
    );
};

export default ComputationParameters;
