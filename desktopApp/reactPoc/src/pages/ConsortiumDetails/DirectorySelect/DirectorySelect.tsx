import { useEffect, useState } from "react";
import { useEdgeApi } from "../../../apis/edgeApi/edgeApi";
import { useParams } from "react-router-dom";
import { electronApi } from "../../../apis/electronApi/electronApi";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function DirectorySelect() {
    const consortiumId = useParams<{ consortiumId: string }>().consortiumId as string;
    const [directory, setDirectory] = useState<string>('');
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const { getMountDir, setMountDir } = useEdgeApi();
    const { useDirectoryDialog: openDirectoryDialog } = electronApi;

    // Fetch the current mount directory when the component is mounted
    const fetchMountDir = async () => {
        try {
            const mountDir = await getMountDir(consortiumId);
            setDirectory(mountDir);
            setIsSaved(true); // Assume the initial fetch is already saved
        } catch (err) {
            console.error('Failed to fetch mount directory:', err);
        }
    };

    useEffect(() => {
        fetchMountDir();
    }, [consortiumId]);

    // Handle directory input change
    const handleDirectoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDirectory(e.target.value);
        setIsSaved(false); // Mark as not saved when changes occur
    };

    // Trigger the Electron directory picker
    const handleOpenDirectoryDialog = async () => {
        try {
            const { canceled, error, directoryPath } = await openDirectoryDialog(directory);
            if (!canceled && !error && directoryPath) {
                setDirectory(directoryPath);
                setIsSaved(false); // Mark as not saved when new directory is selected
            }
        } catch (error) {
            console.error('Failed to open directory dialog:', error);
        }
    };

    // Handle saving the selected directory
    const handleSaveDirectory = async () => {
        try {
            await setMountDir(consortiumId, directory);
            setIsSaved(true); // Mark as saved after successful save
        } catch (err) {
            console.error('Failed to save mount directory:', err);
        }
    };

    return (
        <Box p={2} border={1} borderRadius={4} borderColor="grey.300">
            <Typography variant="h6" gutterBottom>
                Directory Select
            </Typography>

            {/* TextField for manual directory input */}
            <TextField
                label="Directory"
                value={directory || ""}
                onChange={handleDirectoryChange}
                fullWidth
                margin="normal"
                variant="outlined"
            />

            {/* Button to trigger the Electron directory picker */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleOpenDirectoryDialog}
                sx={{ mt: 2, mr: 2 }}
            >
                Browse for Directory
            </Button>

            {/* Button to save the selected directory */}
            <Button
                variant="contained"
                color="secondary"
                onClick={handleSaveDirectory}
                disabled={isSaved || !directory} // Disable if already saved or no directory selected
                sx={{ mt: 2 }}
            >
                {isSaved ? "Directory Saved" : "Save Directory"}
            </Button>

            {/* Display the selected directory */}
            <Typography variant="body1" mt={2}>
                {directory ? `Selected Directory: ${directory}` : "No directory selected"}
            </Typography>
        </Box>
    );
}
