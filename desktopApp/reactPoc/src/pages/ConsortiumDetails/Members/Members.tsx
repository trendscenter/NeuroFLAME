import { PublicUser } from "../../../apis/centralApi/generated/graphql";

interface MembersProps {
    members: PublicUser[];
    activeMembers: PublicUser[];
    leader: PublicUser;
}

export function Members({ members, activeMembers, leader }: MembersProps) {
    // Create a new list of members with associated properties
    const memberList = members.map((member) => ({
        ...member,
        isLeader: member.id === leader.id,
        isActive: activeMembers.includes(member),
    })).sort((a, b) => {
        // if (a.isLeader) return -1;
        // if (b.isLeader) return 1;
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return a.username.localeCompare(b.username);
    });

    return (
        <div>
            <h1>Members</h1>
            <ul>
                {memberList.map((member) => (
                    <li key={member.id}>
                        {member.username}
                        {member.isActive && <span> (Active)</span>}
                        {!member.isActive && <span> (Inactive)</span>}
                        {member.isLeader && <strong> (Leader)</strong>}
                    </li>
                ))}
            </ul>
        </div>
    );
}
