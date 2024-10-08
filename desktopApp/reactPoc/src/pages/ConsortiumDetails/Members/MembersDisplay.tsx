import React from "react";
import { Box, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Typography, Button } from "@mui/material";

interface MembersDisplayProps {
    memberList: {
        id: string;
        username: string;
        isActive: boolean;
        isReady: boolean;
        isLeader: boolean;
        isMe: boolean;
    }[];
    handleToggleActive: (memberId: string, isActive: boolean) => void;
    handleToggleReady: (memberId: string, isReady: boolean) => void;
}

export const MembersDisplay = ({ memberList, handleToggleActive, handleToggleReady }: MembersDisplayProps) => (
    <Box p={2} border={1} borderRadius={4} borderColor="grey.300">
        <Typography variant="h5" gutterBottom>
            Members
        </Typography>
        <List>
            {memberList.map(({ id, username, isActive, isReady, isLeader, isMe }) => (
                <ListItem key={id} divider>
                    <ListItemAvatar>
                        <Avatar>{username.charAt(0).toUpperCase()}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={username}
                        secondary={isLeader ? "Leader" : isActive ? "Active" : "Inactive"}
                    />
                    <Box display="flex" alignItems="center">
                        {isLeader && <Chip label="Leader" color="primary" sx={{ mr: 1 }} />}
                        <Chip label={isActive ? "Active" : "Inactive"} color={isActive ? "success" : "default"} sx={{ mr: 1 }} />
                        <Chip label={isReady ? "Ready" : "Not Ready"} color={isReady ? "info" : "default"} />

                        {/* Toggle buttons for "Active" and "Ready" status if the user is viewing themselves */}
                        {isMe && (
                            <>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => handleToggleActive(id, isActive)}
                                    sx={{ ml: 2 }}
                                >
                                    {isActive ? "Set Inactive" : "Set Active"}
                                </Button>

                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleToggleReady(id, isReady)}
                                    sx={{ ml: 2 }}
                                >
                                    {isReady ? "Set Not Ready" : "Set Ready"}
                                </Button>
                            </>
                        )}
                    </Box>
                </ListItem>
            ))}
        </List>
    </Box>
);
