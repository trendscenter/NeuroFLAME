import { Typography, Box } from "@mui/material";

export function TitleAndDescription({ title, description }: { title: string, description: string }) {
    return (
        <Box mb={3} p={2}>
            <Typography variant="h4" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body1" color="textSecondary">
                {description}
            </Typography>
        </Box>
    );
}
