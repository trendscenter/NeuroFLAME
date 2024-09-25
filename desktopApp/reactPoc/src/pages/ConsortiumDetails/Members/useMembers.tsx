import { PublicUser } from "../../../apis/centralApi/generated/graphql";
import { useUserState } from "../../../contexts/UserStateContext";
import { useCentralApi } from "../../../apis/centralApi/centralApi";
import { useParams } from "react-router-dom";
import { useConsortiumDetailsContext } from "../ConsortiumDetailsContext";

interface UseMembersProps {
    members: PublicUser[];
    activeMembers: PublicUser[];
    leader: PublicUser;
}

export const useMembers = ({ members, activeMembers, leader }: UseMembersProps) => {
    const { userId } = useUserState();
    const { consortiumSetMemberActive } = useCentralApi();
    const consortiumId = useParams<{ consortiumId: string }>().consortiumId as string;
    const { refetch } = useConsortiumDetailsContext();

    const isActiveMember = (member: PublicUser) =>
        activeMembers.some((activeMember) => activeMember.id === member.id);

    const memberList = members
        .map((member) => ({
            ...member,
            isLeader: member.id === leader.id,
            isActive: isActiveMember(member),
            isMe: member.id === userId,
        }))
        .sort((a, b) => {
            if (a.isLeader) return -1;
            if (b.isLeader) return 1;
            if (a.isActive && !b.isActive) return -1;
            if (!a.isActive && b.isActive) return 1;
            return a.username.localeCompare(b.username);
        });

    const handleToggleActive = async (memberId: string, isActive: boolean) => {
        try {
            await consortiumSetMemberActive({ consortiumId, active: !isActive });
            refetch();
        } catch (error) {
            console.error("Failed to update member status:", error);
        }
    };

    return { memberList, handleToggleActive };
};
