import { Box, Button } from "@mui/material";
import { useState } from "react";
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

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
            {/* Markdown Editor */}
            <MDEditor
                data-color-mode="light"
                value={notes}
                onChange={(value = '') => setNotes(value)}
                height={400}
            />

            {/* Action Buttons */}
            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 1 }}>
                    Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={onCancel}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
}
