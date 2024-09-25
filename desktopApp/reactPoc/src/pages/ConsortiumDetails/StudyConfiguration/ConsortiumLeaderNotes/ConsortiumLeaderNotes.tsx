import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import ConsortiumLeaderNotesDisplay from "./ConsortiumLeaderNotesDisplay";
import ConsortiumLeaderNotesEdit from "./ConsortiumLeaderNotesEdit";
import { useConsortiumLeaderNotes } from "./useConsortiumLeaderNotes";

interface ConsortiumLeaderNotesProps {
    consortiumLeaderNotes: string;
}

export default function ConsortiumLeaderNotes({ consortiumLeaderNotes }: ConsortiumLeaderNotesProps) {
    const { isEditing, handleEdit, handleSave, handleCancel } = useConsortiumLeaderNotes(consortiumLeaderNotes);

    return (
        <Box p={2} border={1} borderRadius={4} borderColor="grey.300">
            <Typography variant="h6" gutterBottom>
                Consortium Leader Notes
            </Typography>
            {isEditing ? (
                <ConsortiumLeaderNotesEdit
                    consortiumLeaderNotes={consortiumLeaderNotes}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            ) : (
                <ConsortiumLeaderNotesDisplay consortiumLeaderNotes={consortiumLeaderNotes} />
            )}
            {!isEditing && (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleEdit}
                    sx={{ mt: 2 }}
                >
                    Edit
                </Button>
            )}
        </Box>
    );
}
