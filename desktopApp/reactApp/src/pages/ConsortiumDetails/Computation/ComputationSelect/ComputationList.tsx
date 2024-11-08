import React from "react";
import { ComputationListItem } from "../../../../apis/centralApi/generated/graphql";
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Button } from "@mui/material";

interface ComputationListProps {
    computations: ComputationListItem[];
    onSelect: (computationId: string) => void;
}

const ComputationList: React.FC<ComputationListProps> = ({ computations, onSelect }) => {
    return (
        <List>
            {computations.map((computation) => (
                <ListItem key={computation.id} divider>
                    <ListItemAvatar>
                        <Avatar alt={computation.title} src={computation.imageName} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={computation.title}
                        secondary={computation.imageName ? `Image: ${computation.imageName}` : ""}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onSelect(computation.id)}
                    >
                        Select
                    </Button>
                </ListItem>
            ))}
        </List>
    );
};

export default ComputationList;
