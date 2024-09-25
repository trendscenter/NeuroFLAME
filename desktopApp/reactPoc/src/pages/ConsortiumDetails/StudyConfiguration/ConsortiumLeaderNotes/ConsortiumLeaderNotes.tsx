import { Box, Button, Typography } from "@mui/material";
import ConsortiumLeaderNotesDisplay from "./ConsortiumLeaderNotesDisplay";
import ConsortiumLeaderNotesEdit from "./ConsortiumLeaderNotesEdit";
import { useConsortiumLeaderNotes } from "./useConsortiumLeaderNotes";

interface ConsortiumLeaderNotesProps {
    consortiumLeaderNotes: string;
}

export default function ConsortiumLeaderNotes({ consortiumLeaderNotes }: ConsortiumLeaderNotesProps) {
    const { isEditing, handleEdit, handleSave, handleCancel, isLeader } = useConsortiumLeaderNotes(consortiumLeaderNotes);

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
            {/* Only show the Edit button if the user is the leader */}
            {!isEditing && isLeader && (
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
