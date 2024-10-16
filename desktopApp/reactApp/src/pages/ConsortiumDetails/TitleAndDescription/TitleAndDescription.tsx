import { Typography, Box } from "@mui/material";

export function TitleAndDescription({ title, description }: { title: string, description: string }) {
    return (
<<<<<<< HEAD
        <Box mb={3} p={2}>
=======
        <Box marginBottom={2}>
            <Typography fontSize="11px">Consortium:</Typography>
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
            <Typography variant="h4" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body1" color="textSecondary">
                {description}
            </Typography>
        </Box>
    );
}
