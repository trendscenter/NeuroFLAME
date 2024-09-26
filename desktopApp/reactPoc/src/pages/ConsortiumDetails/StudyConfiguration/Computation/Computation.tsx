import { Box, Typography } from "@mui/material";
import { Computation as ComputationType } from "../../../../apis/centralApi/generated/graphql";
import ComputationDisplay from "./ComputationDisplay";
import ComputationSelect from "./ComputationSelect/ComputationSelect";

export default function Computation({ computation }: { computation: ComputationType }) {
    return <Box p={2} border={1} borderRadius={4} borderColor="grey.300">
        <Typography variant="h5" gutterBottom>
            Computation
        </Typography>
        <ComputationSelect />
        <ComputationDisplay computation={computation} />
    </Box>
}