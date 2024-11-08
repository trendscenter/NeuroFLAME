import Grid from '@mui/material/Grid2';
import { Members } from "./Members/Members";
import { TitleAndDescription } from "./TitleAndDescription/TitleAndDescription";
import useConsortiumDetails from "./useConsortiumDetails";
import DirectorySelect from "./DirectorySelect/DirectorySelect";
import { useUserState } from "../../contexts/UserStateContext";
import StartRunButton from "./StartRunButton/StartRunButton";
import MemberLeaveButton from "./MemberLeaveButton/MemberLeaveButton";
import { ConsortiumDetailsProvider } from "./ConsortiumDetailsContext";
import { LatestRun } from "./LatestRun/LatestRun";
import ComputationDisplay from "./ComputationDisplay/ComputationDisplay";
import ConsortiumLeaderNotes from "./ConsortiumLeaderNotes/ConsortiumLeaderNotes";
import Computation from "./Computation/Computation";
import ComputationParameters from "./ComputationParameters/ComputationParameters";
import { useNavigate } from 'react-router-dom';
import { useCentralApi } from "../../apis/centralApi/centralApi";

export default function ConsortiumDetailsPage() {
    const { userId } = useUserState();
    const { data, status, refetch, isLeader } = useConsortiumDetails();
    const { consortiumId, studyConfiguration, members, activeMembers, readyMembers, leader, title, description } = data;
    const navigate = useNavigate();

    const { consortiumLeave } = useCentralApi();

    // Handle leaving the consortium
    const handleLeave = async () => {
        try {
            await consortiumLeave({ consortiumId: consortiumId });
            // You can refetch or update the UI state to reflect the change
        } catch (error) {
            console.error("Failed to leave the consortium:", error);
        } finally {
            navigate('/consortiumList');
        }
    };

    const isActive = activeMembers.some((member) => member.id === userId);

    return (
        <ConsortiumDetailsProvider refetch={refetch} isLeader={isLeader}>
            <Grid container spacing={2} padding={2}>
                <Grid size={{ sm: 6, md: 4 }}>
                    {/* Title and Description Section */}
                    <TitleAndDescription title={title} description={description} />


                    {/* Start Run Button Section (only if leader a computation has been selected) */}
                    {isLeader && studyConfiguration?.computation && (
                        <StartRunButton />
                    )}

                    {/* Start Run Button Section (only if leader a computation has been selected) */}
                    {!isLeader && isActive && (
                        <MemberLeaveButton consortiumId={consortiumId} />
                    )}


                    {/* Directory Select Section (only if active) */}
                    {isActive &&  (
                        <DirectorySelect />
                    )}

                    {/* Members Section */}
                    <Members members={members} activeMembers={activeMembers} readyMembers={readyMembers} leader={leader} />
                    {studyConfiguration && <ConsortiumLeaderNotes consortiumLeaderNotes={studyConfiguration?.consortiumLeaderNotes} />}
                </Grid>
                <Grid size={{ sm: 6, md: 4 }} className="consortium-details-grid-2">
                    {/* Consortium Link @ Smaller Viewport */}
                    <a onClick={() => navigate('/consortiumList')} className='consortium-list-link'>
                        &#60; Back To Consortium List
                    </a>
                    {/* Latest Run */}
                    <LatestRun />
                    {/* Computation */}
                    <Computation computation={studyConfiguration?.computation} />
                    {/* Computation Parameters */}
                    {studyConfiguration && studyConfiguration?.computation && <ComputationParameters computationParameters={studyConfiguration?.computationParameters} />}
                </Grid>
                <Grid size={{ sm: 12, md: 4 }} className="consortium-details-grid-3">
                     {/* Consortium Link @ Larger Viewport */}
                    <a onClick={() => navigate('/consortiumList')} className='consortium-list-link'>
                        &#60; Back To Consortium List
                    </a>
                    {/* Computation Notes */}
                    <ComputationDisplay computation={studyConfiguration?.computation} />
                </Grid>
            </Grid>
        </ConsortiumDetailsProvider>
    );
}
