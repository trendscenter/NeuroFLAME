import { Computation } from "../../../apis/centralApi/generated/graphql";
import { Box, Chip, Typography, Card, CardContent } from "@mui/material";
import { Maybe } from "graphql/jsutils/Maybe";
import ReactMarkdown from 'react-markdown';


interface ComputationDisplayProps {
    computation: Maybe<Computation> | undefined;
}

export default function ComputationDisplay({ computation }: ComputationDisplayProps) {
    if (!computation) {
        return (
            <Card>
                <CardContent>
                    <Typography fontSize="11px">Computation Notes:</Typography>
                </CardContent>
            </Card>
        );
    }

    const { title, notes, imageName, imageDownloadUrl } = computation;

    return (
        <Box
            className="computation-notes"

            borderRadius={2}

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
                        target="_blank"
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
    );
}
