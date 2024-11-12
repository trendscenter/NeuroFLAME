// src/hooks/useComputationParameters.ts
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCentralApi } from "../../../apis/centralApi/centralApi";
import { useConsortiumDetailsContext } from "../ConsortiumDetailsContext";

export const useComputationParameters = (initialParameters: string) => {
    const [isEditing, setIsEditing] = useState(false);
    const [computationParameters, setComputationParameters] = useState(initialParameters);
    const { studySetParameters } = useCentralApi();
    const consortiumId = useParams<{ consortiumId: string }>().consortiumId as string;
    const { refetch, isLeader } = useConsortiumDetailsContext();
    const handleEdit = () => setIsEditing(true);

    const handleSave = async (newParameters: string) => {
        await studySetParameters({ consortiumId, parameters: newParameters });
        // setComputationParameters(newParameters);
        refetch();
        setIsEditing(false);
    };

    const handleCancel = () => setIsEditing(false);

    return {
        isEditing,
        isLeader,
        computationParameters,
        handleEdit,
        handleSave,
        handleCancel,
    };
};
