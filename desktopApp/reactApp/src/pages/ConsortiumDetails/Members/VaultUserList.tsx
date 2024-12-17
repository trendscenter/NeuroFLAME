// VaultUserList.tsx

import React, { useEffect, useState } from "react";
import { useCentralApi } from "../../../apis/centralApi/centralApi";
import { PublicUser } from "../../../apis/centralApi/generated/graphql";
import { useParams } from "react-router-dom";
import {
    Container,
    List,
    ListItem,
    ListItemText,
    Button,
    Divider,
    Typography,
} from "@mui/material";

interface VaultUserListProps {
    onClose: () => void;
}

const VaultUserList: React.FC<VaultUserListProps> = ({ onClose }) => {
    const { getVaultUserList, leaderAddVaultUser } = useCentralApi();
    const [vaultUserList, setVaultUserList] = useState<PublicUser[]>([]);
    const consortiumId = useParams<{ consortiumId: string }>().consortiumId as string;

    useEffect(() => {
        getVaultUserList()
            .then((res) => setVaultUserList(res))
            .catch((err) => console.error("Error fetching users:", err));
    }, []);

    const handleAdd = async (userId: string) => {
        try {
            await leaderAddVaultUser({ consortiumId, userId });
            onClose();
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Vaults
            </Typography>
            <List>
                {vaultUserList.map(({ id, username, vault }) => (
                    <React.Fragment key={id}>
                        <ListItem
                            secondaryAction={
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleAdd(id)}
                                >
                                    Add
                                </Button>
                            }
                        >
                            <ListItemText
                                primary={username}
                                secondary={vault?.name || "No Vault Assigned"}
                            />
                        </ListItem>
                        <Divider component="li" />
                    </React.Fragment>
                ))}
            </List>
        </Container>
    );
};

export default VaultUserList;
