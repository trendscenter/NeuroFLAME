import { Box, Button } from "@mui/material";
import { useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{'list': 'bullet'}],
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
];

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

    const handleContentChange = (content: any) => {
        setNotes(content);
      };

    return (
        <Box>
            <ReactQuill 
                theme="snow" 
                value={notes} 
                onChange={handleContentChange} 
                modules={modules} 
                formats={formats}
            />
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
