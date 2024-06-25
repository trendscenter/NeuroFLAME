// useLogin.jsx
import { gql, useMutation } from '@apollo/client';
import { useApolloClientsContext } from './ApolloClientsContext';
import { useAuthContext } from './AuthContext';

const LOGIN_USER = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
      refreshToken
      id
    }
  }
`;

const CONNECT_TO_CENTRAL_API_SERVER = gql`
  mutation connectAsUser($accessToken: String!, $refreshToken: String!) {
    connectAsUser(accessToken: $accessToken, refreshToken: $refreshToken)
  }
`;

export function useLogin(onSuccess, onError) {
    // Get the Apollo clients
    const { centralServerClient, federatedClientClient } = useApolloClientsContext()
    const { setAuthInfo} = useAuthContext();

    // Setup the mutations with their respective clients
    const [authenticateAsUser, authenticateStatus] = useMutation(LOGIN_USER, { client: centralServerClient });
    const [connectAsUser, connectStatus] = useMutation(CONNECT_TO_CENTRAL_API_SERVER, { client: federatedClientClient });

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
                    accessToken: authenticateData.login.accessToken,
                    refreshToken: authenticateData.login.refreshToken,
                    userId: authenticateData.login.id
                });

                // Attempt to connect
                const { data: connectData } = await connectAsUser({
                    variables: {
                        accessToken: authenticateData.login.accessToken,
                        refreshToken: authenticateData.login.refreshToken,
                    },
                    context: {
                        headers: {
                            "x-access-token": authenticateData.login.accessToken,
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
        connectStatus
    };
}
