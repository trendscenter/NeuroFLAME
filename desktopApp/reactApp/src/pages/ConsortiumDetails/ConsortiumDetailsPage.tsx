<<<<<<< HEAD
import { Grid, Box, Divider } from "@mui/material";
=======
import Grid from '@mui/material/Grid2';
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
import { StudyConfiguration } from "./StudyConfiguration/StudyConfiguration";
import { Members } from "./Members/Members";
import { TitleAndDescription } from "./TitleAndDescription/TitleAndDescription";
import useConsortiumDetails from "./useConsortiumDetails";
import DirectorySelect from "./DirectorySelect/DirectorySelect";
import { useUserState } from "../../contexts/UserStateContext";
import StartRunButton from "./StartRunButton/StartRunButton";
import { ConsortiumDetailsProvider } from "./ConsortiumDetailsContext";
import { LatestRun } from "./LatestRun/LatestRun";
<<<<<<< HEAD
=======
import ComputationDisplay from "./StudyConfiguration/Computation/ComputationDisplay";
import ConsortiumLeaderNotes from "./ConsortiumLeaderNotes/ConsortiumLeaderNotes";
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)

export default function ConsortiumDetailsPage() {
    const { userId } = useUserState();
    const { data, status, refetch, isLeader } = useConsortiumDetails();
    const { studyConfiguration, members, activeMembers, readyMembers, leader, title, description } = data;

<<<<<<< HEAD
=======
    interface StudyConfiguration {
        computation: any;
        consortiumLeaderNotes: string;
    }

>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
    const isActive = activeMembers.some((member) => member.id === userId);

    return (
        <ConsortiumDetailsProvider refetch={refetch} isLeader={isLeader}>
<<<<<<< HEAD
            <Box p={3}>
                {/* Title and Description Section */}
                <TitleAndDescription title={title} description={description} />

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {/* Members Section */}
                    <Grid item xs={12} md={6}>
                        <Members members={members} activeMembers={activeMembers} readyMembers={readyMembers} leader={leader} />
                    </Grid>

                    {/* Directory Select Section (only if active) */}
                    {isActive && (
                        <Grid item xs={12} md={6}>
                            <DirectorySelect />
                        </Grid>
                    )}

                    {/* Start Run Button Section (only if leader) */}
                    {isLeader && (
                        <Grid item xs={12} md={6}>
                            <StartRunButton />
                        </Grid>
                    )}
                    <Grid item xs={12} md={6}>
                        <LatestRun />
                    </Grid>
                </Grid>

                {/* Divider */}
                <Divider sx={{ my: 4 }} />

                {/* Study Configuration Section */}
                <StudyConfiguration studyConfiguration={studyConfiguration} />
            </Box>
=======
            <Grid container spacing={2} padding={2}>
                <Grid size={{ sm: 6, md: 4 }}>
                    {/* Title and Description Section */}
                    <TitleAndDescription title={title} description={description} />


                    {/* Start Run Button Section (only if leader) */}
                    {isLeader && (
                        <StartRunButton />
                    )}

                    {/* Directory Select Section (only if active) */}
                    {isActive && (
                        <DirectorySelect />
                    )}

                    {/* Members Section */}
                    <Members members={members} activeMembers={activeMembers} readyMembers={readyMembers} leader={leader} />
                    <ConsortiumLeaderNotes consortiumLeaderNotes={(studyConfiguration as StudyConfiguration).consortiumLeaderNotes} />
                </Grid>
                <Grid size={{ sm: 6, md: 4 }}>
                    {/* Latest Run M */}
                    <LatestRun />
                    {/* Study Configuration Section */}
                    <StudyConfiguration studyConfiguration={studyConfiguration} />
                </Grid>
                <Grid size={{ sm: 12, md: 4 }}>
                    <ComputationDisplay computation={(studyConfiguration as StudyConfiguration).computation} />
                </Grid>
            </Grid>
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
        </ConsortiumDetailsProvider>
    );
}
