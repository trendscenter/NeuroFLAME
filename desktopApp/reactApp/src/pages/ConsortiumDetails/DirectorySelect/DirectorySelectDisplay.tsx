import React, { useRef } from 'react';
import { Box, Button, InputAdornment, TextField, Tooltip, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

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
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFocus = () => {
        if (inputRef && inputRef.current) {
            inputRef.current.focus();
            onStartEdit();
        }
    };

    const iconDisplay = () => {
        return isEditing ? 'none' : '';
    }

    const filePathAbbr = (path: string) => {
        var parts = path.split('/').slice(-3);
        var newPath = ( parts.length == 3 ? '/' : '' ) + parts.join('/');
        return '...'+newPath;
    }

    return (
        <>
        {directory ? 
            <Box p={2} border={1} borderRadius={2} borderColor="grey.300" marginBottom={2} bgcolor={'white'}>
            <Typography variant="h6">
                Data Directory
            </Typography>
            {/* TextField for manual directory input, disabled unless in edit mode */}
            <TextField
                size="small"
                inputRef={inputRef}
                value={isEditing ? directory || "" : filePathAbbr(directory) || ""}
                onFocus={handleFocus}
                onChange={(e) => onDirectoryChange(e.target.value)}
                multiline={isEditing}
                fullWidth
                variant="outlined"
                sx={{
                    margin: '0.5rem 0',
                    backgroundColor: isEditing ? 'white' : '#eee',
                    outline: 'none',
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end" sx={{ display: iconDisplay, cursor: 'pointer' }}>
                            <Tooltip title="Edit Directory Path">
                                <EditIcon 
                                    sx={{ color: '#888', marginRight: '-5px' }} 
                                    onClick={handleFocus} 
                                    aria-label="Edit directory" 
                                />
                            </Tooltip>
                        </InputAdornment>
                    ),
                }}
            />
            <Box display="flex" gap={1}>
                {/* Button to trigger the Electron directory picker */}
                {!isEditing && <Button
                    variant="contained"
                    color="primary"
                    onClick={onOpenDirectoryDialog}
                    style={{whiteSpace: 'nowrap', fontSize: '10px', backgroundColor: '#0066FF'}}
                >
                    Re-Select Directory
                </Button>}
                {/* Row of Edit, Save, and Cancel buttons */}
                {isEditing && (
                    <Button
                        variant="contained"
                        onClick={onCancelEdit}
                        style={{fontSize: '10px',backgroundColor:"#888"}}
                    >
                        Cancel
                    </Button>
                )}
                {isEditing && isDifferent && (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onSaveDirectory}
                        style={{fontSize: '10px',backgroundColor:"#2FA84F"}}
                        disabled={!isDifferent} // Save only if canSave is true
                    >
                        Save
                    </Button>
                )}
            </Box>
        </Box> :  
        <Button
        variant="contained"
        sx={{
            marginBottom: '1rem', 
            backgroundColor: '#2FB600',
            borderRadius: '1.2rem'
        }}
        fullWidth
        onClick={onOpenDirectoryDialog}
        style={{backgroundColor: '#0066FF'}}>
            Select Data Directory
        </Button>}
        </>
    );
}
