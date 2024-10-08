import React from "react";
import { Box, Card, CardContent, CardActions, Avatar, Chip, Typography, Switch, FormControlLabel } from "@mui/material";

interface MembersDisplayProps {
    memberList: {
        id: string;
        username: string;
        isActive: boolean;
        isReady: boolean;
        isLeader: boolean;
        isMe: boolean;
    }[];
    setMemberActive: (memberId: string, isActive: boolean) => void;
    setMemberReady: (memberId: string, isReady: boolean) => void;
}

export const MembersDisplay = ({ memberList, setMemberActive, setMemberReady }: MembersDisplayProps) => (
    <Box p={2} border={1} borderRadius={4} borderColor="grey.300">
        <Typography variant="h5" gutterBottom>
            Members
        </Typography>
        {memberList.map(({ id, username, isActive, isReady, isLeader, isMe }) => (
            <Card key={id} variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Box display="flex" alignItems="center">
                        {/* Avatar and Username */}
                        <Avatar sx={{ mr: 2 }}>{username.charAt(0).toUpperCase()}</Avatar>
                        <Box>
                            <Typography variant="h6">{username}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                {isLeader ? "Leader" : isActive ? "Active" : "Inactive"}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Status Chips */}
                    <Box mt={2} display="flex" gap={1}>
                        {isLeader && <Chip label="Leader" color="primary" />}
                        <Chip label={isActive ? "Active" : "Inactive"} color={isActive ? "success" : "default"} />
                        <Chip label={isReady ? "Ready" : "Not Ready"} color={isReady ? "info" : "default"} />
                    </Box>
                </CardContent>

                {/* Toggle Switches Section */}
                {isMe && (
                    <CardActions>
                        {/* Active/Inactive Switch */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isActive}
                                    onChange={(_, checked) => setMemberActive(id, checked)} // Corrected onChange
                                    color="secondary"
                                />
                            }
                            label={isActive ? "Active" : "Inactive"}
                            sx={{ mr: 2 }}
                        />

                        {/* Ready/Not Ready Switch */}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isReady}
                                    onChange={(_, checked) => setMemberReady(id, checked)} // Corrected onChange
                                    color="primary"
                                />
                            }
                            label={isReady ? "Ready" : "Not Ready"}
                        />
                    </CardActions>
                )}
            </Card>
        ))}
    </Box>
);
