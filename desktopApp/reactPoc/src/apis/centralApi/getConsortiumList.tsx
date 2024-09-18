import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client';

interface ConsortiumListItem {
    title: string
    description: string
    leader: PublicUser
    members: PublicUser[]
}

interface PublicUser {
    id: string
    username: string
}

// Define the GraphQL query for fetching the consortium list
const GET_CONSORTIUM_LIST_QUERY = gql`
  query GetConsortiumList {
    getConsortiumList {
      title
      description
      leader {
        id
        username
      }
      members {
        id
        username
      }
    }
  }
`;

// Define the response structure for the consortium list query
interface GetConsortiumListResponse {
    getConsortiumList: ConsortiumListItem[];
}

// Fetch the consortium list from the GraphQL API using Apollo Client
export const getConsortiumList = async (
    apolloClient: ApolloClient<NormalizedCacheObject>
): Promise<ConsortiumListItem[]> => {
    const { data, errors } = await apolloClient.query<GetConsortiumListResponse>({
        query: GET_CONSORTIUM_LIST_QUERY,
    });

    // Throw GraphQL errors if present
    if (errors?.length) {
        throw new Error(errors.map(err => err.message).join(', '));
    }

    // Ensure data exists
    if (!data?.getConsortiumList) {
        throw new Error('Failed to fetch consortium list: No data returned');
    }

    return data.getConsortiumList;
};
