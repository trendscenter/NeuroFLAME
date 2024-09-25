import React from 'react';
import { ListItem, ListItemText } from '@mui/material';
import { ConsortiumListItem as ConsortiumListItemType } from '../../apis/centralApi/generated/graphql'; // Import the type
import { useNavigate } from 'react-router-dom';

interface ConsortiumListItemProps {
    consortium: ConsortiumListItemType;
}

const ConsortiumListItem: React.FC<ConsortiumListItemProps> = ({ consortium }) => {
    const navigate = useNavigate();

    return (
        <ListItem divider onClick={() => {
            navigate(`/consortium/details/${consortium.id}`);
        }}>
            <ListItemText
                primary={consortium.title || 'No Title'}
                secondary={consortium.description || 'No Description'}
            />
        </ListItem>
    );
};

export default ConsortiumListItem;
