import { useEffect, useState, useCallback } from "react";
import { useCentralApi } from "../../apis/centralApi/centralApi";
import { PublicUser } from "../../apis/centralApi/generated/graphql";

const useConsortiumDetails = (consortiumId: string | undefined) => {
    const { getConsortiumDetails } = useCentralApi();
    const [studyConfiguration, setStudyConfiguration] = useState({});
    const [members, setMembers] = useState<PublicUser[]>([]);
    const [activeMembers, setActiveMembers] = useState<PublicUser[]>([]);
    const [leader, setLeader] = useState<PublicUser>({ id: '', username: '' });
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchConsortiumDetails = useCallback(async () => {
        if (!consortiumId) return;
        setLoading(true);
        setError(null);

        try {
            const result = await getConsortiumDetails({ consortiumId });
            setMembers(result.members);
            setActiveMembers(result.activeMembers);
            setLeader(result.leader);
            setTitle(result.title);
            setDescription(result.description);
            setStudyConfiguration(result.studyConfiguration);
        } catch (err) {
            setError("Failed to fetch consortium details.");
        } finally {
            setLoading(false);
        }
    }, [consortiumId, getConsortiumDetails]);

    useEffect(() => {
        fetchConsortiumDetails();
    }, []);

    return {
        data: {
            studyConfiguration,
            members,
            activeMembers,
            leader,
            title,
            description,
        },
        status: {
            loading,
            error,
        },
        refetch: fetchConsortiumDetails // expose refetch method
    };
};

export default useConsortiumDetails;

