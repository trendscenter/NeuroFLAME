import { Box, Card, CardContent, Typography } from "@mui/material";
import { HashLink } from 'react-router-hash-link';
import type { Computation }  from "../../../apis/centralApi/generated/graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import ComputationSelect from "./ComputationSelect/ComputationSelect";
import { useConsortiumDetailsContext } from "../ConsortiumDetailsContext";

interface ComputationDisplayProps {
    computation: Maybe<Computation> | undefined;
}

export default function Computation({ computation }: ComputationDisplayProps) {
    const { isLeader } = useConsortiumDetailsContext();

    if (!computation) {
        return (
            <Box p={2} borderRadius={2} marginBottom={2} bgcolor={'white'}>
                <Typography variant="h6">Computation</Typography>
                <Typography variant="body1">No computation selected</Typography>
                <Box marginTop="1rem">
                {isLeader && (
                     <ComputationSelect computation={computation} />
                )}
                </Box>
            </Box>
        );
    }

    const { title, imageName } = computation;

    return (
        <Box p={2} borderRadius={2} marginBottom={2} bgcolor={'white'} display="flex" justifyContent="space-between">
            <Box>
                <Typography variant="h6" gutterBottom>
                    Computation
                </Typography>
                <Typography variant="h6" fontWeight="600" color="black" lineHeight="1">{title}</Typography>
                <Typography variant="body1" marginBottom="0.2rem">{imageName}</Typography>
                <HashLink id="compnotes-anchor" style={{ fontSize: '0.9rem' }} to="#compnotes">
                    View Computation Notes
                </HashLink>
            </Box>
            {isLeader && (
                <Box display="flex" flexDirection="column" justifyContent="center">
                    <ComputationSelect computation={computation} />
                </Box>
            )}
        </Box>
    );
}
