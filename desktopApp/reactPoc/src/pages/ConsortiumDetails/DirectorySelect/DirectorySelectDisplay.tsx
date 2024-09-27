import { Box, Button, TextField, Typography } from "@mui/material";

interface DirectorySelectDisplayProps {
    directory: string;
    isEditing: boolean;
    isDifferent: boolean; // Positive flag for save
    onDirectoryChange: (newDirectory: string) => void;
    onSaveDirectory: () => void;
    onCancelEdit: () => void;
    onStartEdit: () => void; // Explicit start edit function
    onOpenDirectoryDialog: () => void;
}

export function DirectorySelectDisplay({
    directory,
    isEditing,
    isDifferent,
    onDirectoryChange,
    onOpenDirectoryDialog,
    onSaveDirectory,
    onCancelEdit,
    onStartEdit,
}: DirectorySelectDisplayProps) {
    return (
        <Box p={2} border={1} borderRadius={4} borderColor="grey.300">
            <Typography variant="h6" gutterBottom>
                Directory Select
            </Typography>

            {/* Row of Edit, Save, and Cancel buttons */}
            <Box display="flex" gap={2} mb={2}>
                {isEditing ? (
                    <>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={onSaveDirectory}
                            disabled={!isDifferent} // Save only if canSave is true
                        >
                            Save
                        </Button>

                        <Button
                            variant="contained"
                            onClick={onCancelEdit}
                        >
                            Cancel
                        </Button>
                    </>
                ) : (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onStartEdit} // Start editing
                    >
                        Edit
                    </Button>
                )}
            </Box>

            {/* TextField for manual directory input, disabled unless in edit mode */}
            <TextField
                label="Directory"
                value={directory || ""}
                onChange={(e) => onDirectoryChange(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
                disabled={!isEditing} // Disable if not editing
            />

            {/* Button to trigger the Electron directory picker */}
            {isEditing && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onOpenDirectoryDialog}
                    sx={{ mt: 2 }}
                >
                    Browse for Directory
                </Button>
            )}
        </Box>
    );
}
