import React from 'react';
import { Box, Typography } from '@mui/material';
import Computation from "./Computation/Computation";
import ComputationParameters from "./ComputationParameters/ComputationParameters";

export function StudyConfiguration({ studyConfiguration }: { studyConfiguration: any }) {
    const { computation, computationParameters } = studyConfiguration;

    return (
        <Box>
            <Box>
                <Computation computation={computation} />
            </Box>
            {computation && <Box>
                <ComputationParameters computationParameters={computationParameters} />
            </Box>}
        </Box>
    );
}
