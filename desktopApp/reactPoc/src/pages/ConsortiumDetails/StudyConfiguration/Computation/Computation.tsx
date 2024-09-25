import { Computation as ComputationType } from "../../../../apis/centralApi/generated/graphql";
import ComputationDisplay from "./ComputationDisplay";
import ComputationSelect from "./ComputationSelect/ComputationSelect";

export default function Computation({computation}: {computation: ComputationType}) {
    return <div>
        <ComputationSelect/>
        <ComputationDisplay computation={computation}/>
    </div>
}