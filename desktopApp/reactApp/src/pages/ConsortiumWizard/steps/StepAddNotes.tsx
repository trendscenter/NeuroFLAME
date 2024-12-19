import { Box } from '@mui/material'; 
import ConsortiumLeaderNotes from "../../ConsortiumDetails/ConsortiumLeaderNotes/ConsortiumLeaderNotes";
import { useConsortiumDetailsContext } from "../../ConsortiumDetails/ConsortiumDetailsContext";

export default function StepAddNotes(){
    const {data: consortiumDetails} = useConsortiumDetailsContext();
    const consortiumLeaderNotes = consortiumDetails?.studyConfiguration?.consortiumLeaderNotes;

    return (
    <Box style={{
        maxWidth: '400px',
        border: '1px solid #eee',
    }}>
        <ConsortiumLeaderNotes consortiumLeaderNotes={consortiumLeaderNotes ? consortiumLeaderNotes : ''} />
    </Box>)
}