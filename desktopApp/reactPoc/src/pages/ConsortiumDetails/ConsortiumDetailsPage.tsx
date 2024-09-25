import { useParams } from "react-router-dom";
import { Grid, Box, Typography } from "@mui/material";

import { StudyConfiguration } from "./StudyConfiguration/StudyConfiguration";
import { Members } from "./Members/Members";
import { TitleAndDescription } from "./TitleAndDescription/TitleAndDescription";
import useConsortiumDetails from "./useConsortiumDetails";
import DirectorySelect from "./DirectorySelect/DirectorySelect";
import { useUserState } from "../../contexts/UserStateContext";
import StartRunButton from "./StartRunButton/StartRunButton";
import { ConsortiumDetailsProvider } from "./ConsortiumDetailsContext";

export default function ConsortiumDetailsPage() {
    const { userId } = useUserState();
    const { data, status, refetch, isLeader } = useConsortiumDetails();
    const { studyConfiguration, members, activeMembers, leader, title, description } = data;

    const isActive = activeMembers.some((member) => member.id === userId);

    return (
        <ConsortiumDetailsProvider refetch={refetch} isLeader={isLeader}>
            <Box p={3}>
                <TitleAndDescription title={title} description={description} />

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Members members={members} activeMembers={activeMembers} leader={leader} />
                    </Grid>
                    {isActive && (
                        <Grid item xs={12} md={6}>
                            <DirectorySelect />
                        </Grid>
                    )}
                    {isLeader && (
                        <Grid item xs={12} md={6}>
                            <StartRunButton />
                        </Grid>
                    )}
                </Grid>
                <StudyConfiguration studyConfiguration={studyConfiguration} />
            </Box>
        </ConsortiumDetailsProvider>
    );
}
