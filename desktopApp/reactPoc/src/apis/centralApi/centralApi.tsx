import { useApolloClients } from "../../contexts/ApolloClientsContext";
import { login } from "./login"

export const useCentralApi = () => {
    const { centralApiApolloClient } = useApolloClients();

    if (!centralApiApolloClient) {
        throw new Error("Apollo Client is not defined");
    }

    return {
        login: (username: string, password: string) => login(centralApiApolloClient, username, password),
    };
}