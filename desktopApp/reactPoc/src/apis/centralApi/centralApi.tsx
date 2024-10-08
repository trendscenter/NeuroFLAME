import { useApolloClients } from "../../contexts/ApolloClientsContext";
import { login } from "./login";
import { getConsortiumList } from "./getConsortiumList";
import { getConsortiumDetails } from "./getConsortiumDetails";
import { getRunDetails } from "./getRunDetails"; // Import the getRunDetails function
import { MutationConsortiumSetMemberActiveArgs, MutationLoginArgs, MutationStartRunArgs, MutationStudySetComputationArgs, MutationStudySetNotesArgs, MutationStudySetParametersArgs, QueryGetConsortiumDetailsArgs, QueryGetRunListArgs, QueryGetRunDetailsArgs } from "./generated/graphql"; // Import generated types
import { studySetParameters } from "./studySetParameters";
import { getComputationList } from "./getComputationList";
import { studySetComputation } from "./studySetComputation";
import { consortiumSetMemberActive } from "./consortiumSetMemberActive";
import { startRun } from "./startRun";
import { studySetNotes } from "./studySetNotes";
import { consortiumDetailsChanged } from "./subscriptions/consortiumDetailsChanged";
import { getRunList } from "./getRunList";
import { consortiumLatestRunChanged } from "./subscriptions/consortiumLatestRunChanged";
import { runDetailsChanged } from "./subscriptions/runDetailsChanged";

export const useCentralApi = () => {
    const { centralApiApolloClient } = useApolloClients();

    // Handle Apollo Client being undefined
    if (!centralApiApolloClient) {
        throw new Error("Apollo Client is not defined");
    }

    return {
        getConsortiumList: () => getConsortiumList(centralApiApolloClient),
        getComputationList: () => getComputationList(centralApiApolloClient),
        getConsortiumDetails: (input: QueryGetConsortiumDetailsArgs) => getConsortiumDetails(centralApiApolloClient, input),
        getRunDetails: (input: QueryGetRunDetailsArgs) => getRunDetails(centralApiApolloClient, input), // Added getRunDetails here
        login: (input: MutationLoginArgs) => login(centralApiApolloClient, input),
        studySetParameters: (input: MutationStudySetParametersArgs) => studySetParameters(centralApiApolloClient, input),
        studySetComputation: (input: MutationStudySetComputationArgs) => studySetComputation(centralApiApolloClient, input),
        consortiumSetMemberActive: (input: MutationConsortiumSetMemberActiveArgs) => consortiumSetMemberActive(centralApiApolloClient, input),
        startRun: (input: MutationStartRunArgs) => startRun(centralApiApolloClient, input),
        studySetNotes: (input: MutationStudySetNotesArgs) => studySetNotes(centralApiApolloClient, input),
        getRunList: (input: QueryGetRunListArgs) => getRunList(centralApiApolloClient, input),
        subscriptions: {
            consortiumDetailsChanged: (input: { consortiumId: string }) => consortiumDetailsChanged(centralApiApolloClient, input),
            consortiumLatestRunChanged: (input: { consortiumId: string }) => consortiumLatestRunChanged(centralApiApolloClient, input),
            runDetailsChanged: (input: { runId: string }) => runDetailsChanged(centralApiApolloClient, input)
        }
    };
};
