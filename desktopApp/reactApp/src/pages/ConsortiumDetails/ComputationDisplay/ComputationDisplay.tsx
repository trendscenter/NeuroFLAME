import { Computation } from "../../../apis/centralApi/generated/graphql";
import { Box, Typography, Card, CardContent, IconButton } from "@mui/material";
import { Maybe } from "graphql/jsutils/Maybe";
import ReactMarkdown from 'react-markdown';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from "react";

interface ComputationDisplayProps {
    computation: Maybe<Computation> | undefined;
}

export default function ComputationDisplay({ computation }: ComputationDisplayProps) {
    const [copied, setCopied] = useState(false);

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

    const handleCopy = () => {
        if (imageDownloadUrl) {
            navigator.clipboard.writeText(imageDownloadUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset copy status after 2 seconds
        }
    };

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
                
                <Box display="flex" alignItems="center" marginY={1}>
                    <Typography 
                        component="code" 
                        sx={{ 
                            bgcolor: '#f5f5f5', 
                            padding: '4px 8px', 
                            borderRadius: 1, 
                            fontFamily: 'monospace', 
                            fontSize: '0.875rem' 
                        }}
                    >
                        {imageDownloadUrl}
                    </Typography>
                    <IconButton 
                        onClick={handleCopy} 
                        size="small" 
                        aria-label="copy download URL"
                        sx={{ marginLeft: 1 }}
                    >
                        <ContentCopyIcon fontSize="small" />
                    </IconButton>
                    {copied && <Typography fontSize="0.75rem" color="green" marginLeft={1}>Copied!</Typography>}
                </Box>

                <Box>
                    <ReactMarkdown>{notes}</ReactMarkdown>
                </Box>
            </CardContent>
        </Box>
    );
}
