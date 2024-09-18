import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client';

interface LoginResponse {
  accessToken: string;
  userId: string;
  username: string;
  roles: string[];
}

export const login = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  username: string,
  password: string
): Promise<LoginResponse> => {
  const LOGIN_MUTATION = gql`
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        accessToken
        userId
        username
        roles
      }
    }
  `;

  const { data, errors } = await apolloClient.mutate<{ login: LoginResponse }>({
    mutation: LOGIN_MUTATION,
    variables: { username, password },
  });

  // Throw GraphQL errors if present
  if (errors?.length) {
    throw new Error(errors.map(err => err.message).join(', '));
  }

  // Ensure login data exists
  if (!data?.login) {
    throw new Error('Login failed: No data returned');
  }

  return data.login;
};
