import MemberAvatar from '../MemberAvatar';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckedIcon from '@mui/icons-material/CheckCircle';
import UnpublishedIcon from '@mui/icons-material/Unpublished';

export default function MembersPanel({
    panelCustomStyles,
    panelConsortiumDetails,
    panelUserId,
    panelUserIsActive,
    panelUserIsLeader,
    panelUserIsMember,
    panelHandleSetActive,
    panelHandleLeaveConsortium,
}) {

    const renderMembers = (members, admin, active) =>
        members.map((member, index) => {
        return( 
        <MemberAvatar 
            key={index}
            index={index}
            username={member.username} 
            admin={member.username === admin} 
            active={active.find(el => el['username'] === member.username)} />
        )
    });

    return (
        <div style={panelCustomStyles.container}>
        <div style={panelCustomStyles.labelBetween}>
        <h3 style={panelCustomStyles.h3}>Members</h3>
        <div>
            <span style={{marginRight: '0.25rem'}}>
                {panelUserId && panelUserIsActive && 
                    <UnpublishedIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={() => { panelHandleSetActive(false) }} />
                }
                {panelUserId && panelUserIsMember && !panelUserIsActive && 
                    <CheckedIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} onClick={() => { panelHandleSetActive(true) }} />
                }
            </span>
            <span>
                {panelUserIsMember && !panelUserIsLeader && 
                <CancelIcon style={{ color: 'lightpink' }} onClick={() => { panelHandleLeaveConsortium(panelConsortiumDetails.id) }} />
                }
            </span>
        </div>
        </div>
        {renderMembers(panelConsortiumDetails.members, panelConsortiumDetails.leader.username, panelConsortiumDetails.activeMembers)}
    </div>
    )
}