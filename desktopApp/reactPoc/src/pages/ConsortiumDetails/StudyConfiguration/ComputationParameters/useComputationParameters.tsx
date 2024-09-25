// src/hooks/useComputationParameters.ts
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCentralApi } from "../../../../apis/centralApi/centralApi";

export const useComputationParameters = (initialParameters: string) => {
    const [isEditing, setIsEditing] = useState(false);
    const [computationParameters, setComputationParameters] = useState(initialParameters);
    const { studySetParameters } = useCentralApi();
    const consortiumId = useParams<{ consortiumId: string }>().consortiumId as string;

    const handleEdit = () => setIsEditing(true);

    const handleSave = async (newParameters: string) => {
        await studySetParameters({ consortiumId, parameters: newParameters });
        setComputationParameters(newParameters);
        setIsEditing(false);
    };

    const handleCancel = () => setIsEditing(false);

    return {
        isEditing,
        computationParameters,
        handleEdit,
        handleSave,
        handleCancel,
    };
};
