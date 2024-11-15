import { Box } from "@mui/material";
import ReactMarkdown from 'react-markdown';

interface ConsortiumLeaderNotesDisplayProps {
    consortiumLeaderNotes: string;
}

export default function ConsortiumLeaderNotesDisplay({ consortiumLeaderNotes }: ConsortiumLeaderNotesDisplayProps) {
    return (
        <Box>
            {consortiumLeaderNotes && <div>
                <ReactMarkdown>{consortiumLeaderNotes}</ReactMarkdown>
            </div>}
        </Box>
    );
}
