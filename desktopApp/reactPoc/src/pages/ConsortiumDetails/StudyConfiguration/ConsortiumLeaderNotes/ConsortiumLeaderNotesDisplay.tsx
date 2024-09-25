import { Box, Typography } from "@mui/material";

interface ConsortiumLeaderNotesDisplayProps {
    consortiumLeaderNotes: string;
}

export default function ConsortiumLeaderNotesDisplay({ consortiumLeaderNotes }: ConsortiumLeaderNotesDisplayProps) {
    return (
        <Box>
            <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                {consortiumLeaderNotes}
            </Typography>
        </Box>
    );
}
