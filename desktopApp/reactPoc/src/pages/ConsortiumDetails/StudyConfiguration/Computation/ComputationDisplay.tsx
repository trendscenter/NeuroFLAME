import React from "react";
import { Computation } from "../../../../apis/centralApi/generated/graphql";
import { Box, Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Grid, Link } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReactMarkdown from 'react-markdown';

interface ComputationDisplayProps {
    computation: Computation | null;
}

export default function ComputationDisplay({ computation }: ComputationDisplayProps) {
    if (!computation) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5">Computation Display</Typography>
                    <Typography variant="body1">No computation selected</Typography>
                </CardContent>
            </Card>
        );
    }

    const { title, notes, imageName, imageDownloadUrl } = computation;

    return (
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
    );
}
