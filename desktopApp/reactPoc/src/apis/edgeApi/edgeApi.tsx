import { useApolloClients } from "../../contexts/ApolloClientsContext";
import { connectAsUser } from "./connectAsUser"

export const useEdgeApi = () => {
    const { edgeClientApolloClient } = useApolloClients();

    if (!edgeClientApolloClient) {
        throw new Error("Apollo Client is not defined");
    }

    return {
        connectAsUser: () => connectAsUser(edgeClientApolloClient),
    };
}