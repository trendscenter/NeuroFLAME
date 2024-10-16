import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";

interface ConsortiumLeaderNotesEditProps {
    consortiumLeaderNotes: string;
    onSave: (newNotes: string) => void;
    onCancel: () => void;
}

export default function ConsortiumLeaderNotesEdit({
    consortiumLeaderNotes,
    onSave,
    onCancel,
}: ConsortiumLeaderNotesEditProps) {
    const [notes, setNotes] = useState(consortiumLeaderNotes);

    const handleSave = () => {
        onSave(notes);
    };

    return (
        <Box>
            <TextField
                label="Consortium Leader Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                fullWidth
                rows={4}
            />
            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 2 }}>
                    Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={onCancel}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
}
