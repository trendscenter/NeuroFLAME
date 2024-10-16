import { Box, Typography } from "@mui/material";
import { Computation as ComputationType } from "../../../../apis/centralApi/generated/graphql";
<<<<<<< HEAD
import ComputationDisplay from "./ComputationDisplay";
=======
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
import ComputationSelect from "./ComputationSelect/ComputationSelect";
import { useConsortiumDetailsContext } from "../../ConsortiumDetailsContext";

export default function Computation({ computation }: { computation: ComputationType }) {
    const { isLeader } = useConsortiumDetailsContext();

<<<<<<< HEAD
    return <Box p={2} border={1} borderRadius={4} borderColor="grey.300">
        <Typography variant="h5" gutterBottom>
            Computation
        </Typography>
        {
            isLeader && <ComputationSelect />
        }
        <ComputationDisplay computation={computation} />
=======
    return <Box p={2} border={1} borderRadius={2} borderColor="grey.300" marginBottom={2} bgcolor={'white'} display="flex" justifyContent="space-between">
        <Box>
            <Typography variant="h6" gutterBottom>
                Computation
            </Typography>
            <Typography variant="h6" fontWeight="600" color="black" lineHeight="1">{computation?.title}</Typography>
            <Typography variant="body1" marginBottom="0.2rem">{computation?.imageName}</Typography>
            <a id="compnotes-anchor" style={{fontSize: '0.9rem'}} href="#compnotes">View Notes</a>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center">
            {isLeader && <ComputationSelect />}
        </Box>
>>>>>>> bc92e82 (Moving earlier reactApp to reactAppOld. Using latest reactPoc to create new reactApp with UI embellishments)
    </Box>
}