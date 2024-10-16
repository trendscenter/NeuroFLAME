<<<<<<< HEAD
import { PublicUser } from "../../../apis/centralApi/generated/graphql";
import { useUserState } from "../../../contexts/UserStateContext";
import { useCentralApi } from "../../../apis/centralApi/centralApi";
=======
import React, { useEffect, useState } from "react";
import { PublicUser } from "../../../apis/centralApi/generated/graphql";
import { useUserState } from "../../../contexts/UserStateContext";
import { useCentralApi } from "../../../apis/centralApi/centralApi";
import { useEdgeApi } from "../../../apis/edgeApi/edgeApi";
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
import { useParams } from "react-router-dom";
import { useConsortiumDetailsContext } from "../ConsortiumDetailsContext";

interface UseMembersProps {
    members: PublicUser[];
    activeMembers: PublicUser[];
    readyMembers: PublicUser[];
    leader: PublicUser;
}

export const useMembers = ({ members, activeMembers, readyMembers, leader }: UseMembersProps) => {
    const { userId } = useUserState();
    const { consortiumSetMemberActive, consortiumSetMemberReady } = useCentralApi();
    const consortiumId = useParams<{ consortiumId: string }>().consortiumId as string;
    const { refetch } = useConsortiumDetailsContext();

<<<<<<< HEAD
=======
    const [memberMountDir, setMemberMountDir] = useState<string>('');

>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
    const isActiveMember = (member: PublicUser) =>
        activeMembers.some((activeMember) => activeMember.id === member.id);

    const isReadyMember = (member: PublicUser) =>
        readyMembers.some((readyMember) => readyMember.id === member.id);

    const memberList = members
        .map((member) => ({
            ...member,
            isLeader: member.id === leader.id,
            isActive: isActiveMember(member),
            isReady: isReadyMember(member),
            isMe: member.id === userId,
        }))
        .sort((a, b) => {
            if (a.isLeader) return -1;
            if (b.isLeader) return 1;
            if (a.isActive && !b.isActive) return -1;
            if (!a.isActive && b.isActive) return 1;
            return a.username.localeCompare(b.username);
        });

    const setMemberActive = async (memberId: string, isActive: boolean) => {
        try {
            await consortiumSetMemberActive({ consortiumId, active: isActive });
            refetch();
        } catch (error) {
            console.error("Failed to update member status:", error);
        }
    };

    const setMemberReady = async (memberId: string, isReady: boolean) => {
        try {
            await consortiumSetMemberReady({ consortiumId, ready: isReady });
            refetch();
        } catch (error) {
            console.error("Failed to update member status:", error);
        }
    }

    return { memberList, setMemberActive, setMemberReady };
};
