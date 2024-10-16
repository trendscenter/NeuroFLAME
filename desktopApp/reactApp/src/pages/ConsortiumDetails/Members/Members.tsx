import React from "react";
import { useMembers } from "./useMembers"; // Functional hook
import { MembersDisplay } from "./MembersDisplay"; // Display component
import { PublicUser } from "../../../apis/centralApi/generated/graphql";

interface MembersProps {
    members: PublicUser[];
    activeMembers: PublicUser[];
    readyMembers: PublicUser[];
    leader: PublicUser;
}

export function Members({ members, activeMembers, readyMembers, leader }: MembersProps) {
    const { memberList, setMemberActive, setMemberReady } = useMembers({ members, activeMembers, readyMembers, leader });

<<<<<<< HEAD
    return <MembersDisplay memberList={memberList} setMemberActive={setMemberActive} setMemberReady={setMemberReady} />;
=======
    return <MembersDisplay memberList={memberList} setMemberActive={setMemberActive} setMemberReady={setMemberReady}  />;
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
}
