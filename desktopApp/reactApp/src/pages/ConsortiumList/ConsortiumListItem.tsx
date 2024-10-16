import React, { useState } from 'react';
import { ListItem, ListItemText, Button, Box } from '@mui/material';
import { ConsortiumListItem as ConsortiumListItemType } from '../../apis/centralApi/generated/graphql'; // Import the type
import { useNavigate } from 'react-router-dom';
import { useUserState } from '../../contexts/UserStateContext';

interface ConsortiumListItemProps {
    consortium: ConsortiumListItemType;
}

const ConsortiumListItem: React.FC<ConsortiumListItemProps> = ({ consortium }) => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const { userId } = useUserState();

    const isMember = consortium.members.some(member => member.id === userId);

    const consortiumJoin = async ({ consortiumId }: { consortiumId: string }) => {

    }

    const consortiumLeave = async ({ consortiumId }: { consortiumId: string }) => {

    }


    // Handle joining the consortium
    const handleJoin = async () => {
        setLoading(true);
        try {
            await consortiumJoin({ consortiumId: consortium.id });
            // You can refetch or update the UI state to reflect the change
        } catch (error) {
            console.error("Failed to join the consortium:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle leaving the consortium
    const handleLeave = async () => {
        setLoading(true);
        try {
            await consortiumLeave({ consortiumId: consortium.id });
            // You can refetch or update the UI state to reflect the change
        } catch (error) {
            console.error("Failed to leave the consortium:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ListItem divider>
            <Box flex={1} onClick={() => navigate(`/consortium/details/${consortium.id}`)}>
                <ListItemText
                    primary={consortium.title || 'No Title'}
                    secondary={consortium.description || 'No Description'}
                />
            </Box>
            <Button
                variant="contained"
                color={isMember ? "secondary" : "primary"}
                onClick={isMember ? handleLeave : handleJoin}
                disabled={loading}
                sx={{ ml: 2 }}
            >
                {loading ? "Loading..." : isMember ? "Leave" : "Join"}
            </Button>
        </ListItem>
    );
};

export default ConsortiumListItem;
