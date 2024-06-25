// useLogin.jsx
import { gql, useMutation } from '@apollo/client';
import { ApolloClientsContext } from '../contexts/ApolloClientsContext';
import { useAuthContext } from '../contexts/AuthContext'
import { useContext } from 'react';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

const CONNECT_AS_USER = gql`
  mutation ConnectAsUser {
    connectAsUser
  }
`;

export function useLogin(onSuccess, onError) {
    // Get the Apollo clients
    const { centralApiApolloClient, edgeClientApolloClient } = useContext(ApolloClientsContext)
    const { setAuthInfo } = useAuthContext();



    // Setup the mutations with their respective clients
    const [authenticateAsUser, authenticateStatus] = useMutation(LOGIN_MUTATION, { client: centralApiApolloClient });
    const [connectAsUser, connectStatus] = useMutation(CONNECT_AS_USER, { client: edgeClientApolloClient });

    // The login function that orchestrates the login and connect calls
    const login = async (username, password) => {
        try {
            authenticateStatus.reset();
            connectStatus.reset();

            // Attempt to log in
            const { data: authenticateData } = await authenticateAsUser({ variables: { username, password } });

            // Store tokens on successful login
            if (authenticateData) {
                setAuthInfo({
                    accessToken: authenticateData.login,
                    refreshToken: null,
                    userId: authenticateData.login
                });

                // Attempt to connect
                const { data: connectData } = await connectAsUser({
                    variables: {
                        accessToken: authenticateData.login,
                        refreshToken: authenticateData.login,
                    },
                    context: {
                        headers: {
                            "x-access-token": authenticateData.login,
                        }
                    }
                });

                // Call onSuccess callback if connection is successful
                if (connectData && onSuccess) {
                    onSuccess();
                }
            }
        } catch (e) {
            if (onError) {
                onError(e);
            }
            else {
                console.error(e);
            }
        }
    };

    // Return the states and the login function
    return {
        login,
        authenticateStatus,
        connectStatus,
    };
}
