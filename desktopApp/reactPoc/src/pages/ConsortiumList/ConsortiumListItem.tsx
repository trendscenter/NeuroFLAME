import React from 'react';
import { ListItem, ListItemText } from '@mui/material';
import { ConsortiumListItem as ConsortiumListItemType } from '../../apis/centralApi/generated/graphql'; // Import the type

interface ConsortiumListItemProps {
    consortium: ConsortiumListItemType;
}

const ConsortiumListItem: React.FC<ConsortiumListItemProps> = ({ consortium }) => {
    return (
        <ListItem divider>
            <ListItemText
                primary={consortium.title || 'No Title'}
                secondary={consortium.description || 'No Description'}
            />
        </ListItem>
    );
};

export default ConsortiumListItem;
