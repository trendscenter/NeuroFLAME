import { useApolloClients } from "../../contexts/ApolloClientsContext";
import { login } from "./login";
import { getConsortiumList } from "./getConsortiumList";
import { getConsortiumDetails } from "./getConsortiumDetails";
import { MutationLoginArgs, MutationStudySetComputationArgs, MutationStudySetParametersArgs, QueryGetConsortiumDetailsArgs } from "./generated/graphql"; // Import generated types
import { studySetParameters } from "./studySetParameters";
import { getComputationList } from "./getComputationList";
import { setStudyComputation } from "./studySetComputation";

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
        login: (input: MutationLoginArgs) => login(centralApiApolloClient, input),
        studySetParameters: (input: MutationStudySetParametersArgs) => studySetParameters(centralApiApolloClient, input),
        setStudyComputation: (input: MutationStudySetComputationArgs) => setStudyComputation(centralApiApolloClient, input),
    };
};

