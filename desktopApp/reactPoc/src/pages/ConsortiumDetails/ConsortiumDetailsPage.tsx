import { useParams } from "react-router-dom";
import { useCentralApi } from "../../apis/centralApi/centralApi";
import { getConsortiumDetails } from "../../apis/centralApi/getConsortiumDetails";

export default function ConsortiumDetailsPage() {
    const { getConsortiumDetails } = useCentralApi();
    const { consortiumId } = useParams<{ consortiumId: string }>();

    return <div>{JSON.stringify({ consortiumId })}</div>
}