import { useParams } from "react-router-dom";
import { useCentralApi } from "../../apis/centralApi/centralApi";
import { useEffect, useState } from "react";
import { StudyConfiguration } from "./StudyConfiguration/StudyConfiguration";
import { Members } from "./Members/Members";
import { PublicUser } from "../../apis/centralApi/generated/graphql";
import { TitleAndDescription } from "./TitleAndDescription";
import useConsortiumDetails from "./useConsortiumDetails";

export default function ConsortiumDetailsPage() {
    const { consortiumId } = useParams<{ consortiumId: string }>();
    const { data, status, refetch } = useConsortiumDetails(consortiumId);
    const { studyConfiguration, members, activeMembers, leader, title, description } = data;
    const { loading, error } = status;

    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <button onClick={refetch}>Refetch Details</button>
            <TitleAndDescription title={title} description={description} />
            <Members members={members} activeMembers={activeMembers} leader={leader} />
            <StudyConfiguration studyConfiguration={studyConfiguration} />
        </div>
    );
};
