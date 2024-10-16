import { Box } from "@mui/material";
import parse from 'html-react-parser';

interface ConsortiumLeaderNotesDisplayProps {
    consortiumLeaderNotes: string;
}

export default function ConsortiumLeaderNotesDisplay({ consortiumLeaderNotes }: ConsortiumLeaderNotesDisplayProps) {
    return (
        <Box>
            {consortiumLeaderNotes && <div>
                {parse(consortiumLeaderNotes)}
            </div>}
        </Box>
    );
}
