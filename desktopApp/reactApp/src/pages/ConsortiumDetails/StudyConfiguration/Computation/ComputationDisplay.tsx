<<<<<<< HEAD
import React from "react";
import { Computation } from "../../../../apis/centralApi/generated/graphql";
import { Box, Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Grid, Link } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
=======
import { Computation } from "../../../../apis/centralApi/generated/graphql";
import { Box, Chip, Typography, Card, CardContent, Link } from "@mui/material";
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
import ReactMarkdown from 'react-markdown';

interface ComputationDisplayProps {
    computation: Computation | null;
}

export default function ComputationDisplay({ computation }: ComputationDisplayProps) {
    if (!computation) {
        return (
            <Card>
                <CardContent>
<<<<<<< HEAD
                    <Typography variant="h5">Computation Display</Typography>
=======
                    <Typography variant="h6">Computation Display</Typography>
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
                    <Typography variant="body1">No computation selected</Typography>
                </CardContent>
            </Card>
        );
    }

    const { title, notes, imageName, imageDownloadUrl } = computation;

    return (
<<<<<<< HEAD
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Title</Typography>
                        <Typography variant="body1">{title}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6">Image Name</Typography>
                        <Typography variant="body1">{imageName}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6">Image Download URL</Typography>
                        <Link href={imageDownloadUrl} target="_blank" rel="noopener">
                            {imageDownloadUrl}
                        </Link>
                    </Grid>

                    <Grid item xs={12}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="h6">Notes</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                                    <ReactMarkdown>{notes}</ReactMarkdown>
                                
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
=======
        <Box 
            className="computation-notes"
            border={1} 
            borderRadius={2} 
            borderColor="grey.300" 
            marginBottom={2} 
            bgcolor={'white'} 
        >
            <div id="compnotes" />{/* For Notes anchor placement at 800px wide */}
            <CardContent>
            <Typography fontSize="11px">Computation Notes:</Typography>
                <Typography variant="h5" fontWeight="600" color="black">{title}</Typography>
                <Typography variant="h6">{imageName}</Typography>
                <div className="computation-links">
                    <Chip 
                        label="Download URL" 
                        component="a" 
                        href={imageDownloadUrl} 
                        size="small" 
                        variant="outlined" 
                        clickable 
                    />
                </div>
                <Box>
                    <ReactMarkdown>{notes}</ReactMarkdown>   
                </Box>
            </CardContent>
        </Box>
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
    );
}
