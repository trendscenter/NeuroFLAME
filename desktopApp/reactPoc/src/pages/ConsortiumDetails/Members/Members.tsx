import React from "react";
import { useMembers } from "./useMembers"; // Functional hook
import { MembersDisplay } from "./MembersDisplay"; // Display component
import { PublicUser } from "../../../apis/centralApi/generated/graphql";

interface MembersProps {
    members: PublicUser[];
    activeMembers: PublicUser[];
    leader: PublicUser;
}

export function Members({ members, activeMembers, leader }: MembersProps) {
    const { memberList, handleToggleActive } = useMembers({ members, activeMembers, leader });

    return <MembersDisplay memberList={memberList} handleToggleActive={handleToggleActive} />;
}
