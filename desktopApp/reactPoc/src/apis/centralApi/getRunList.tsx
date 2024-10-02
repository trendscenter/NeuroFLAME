import { ApolloClient, gql, NormalizedCacheObject } from '@apollo/client';
import { Query, QueryGetRunListArgs } from './generated/graphql'; // Import generated types

// Define the GraphQL query for fetching the run list by consortiumId
const GET_RUN_LIST_QUERY = gql`
  query GetRunList($consortiumId: String!) {
    getRunList(consortiumId: $consortiumId) {
      runId
      consortiumTitle
      createdAt
      lastUpdated
      status
    }
  }
`;

// Fetch the run list for a specific consortium from the GraphQL API using Apollo Client
export const getRunList = async (
    apolloClient: ApolloClient<NormalizedCacheObject>,
    input: QueryGetRunListArgs
): Promise<Query['getRunList']> => {
    const { consortiumId } = input;

    const { data, errors } = await apolloClient.query<{ getRunList: Query['getRunList'] }>({
        query: GET_RUN_LIST_QUERY,
        variables: { consortiumId },
    });

    // Throw GraphQL errors if present
    if (errors?.length) {
        throw new Error(errors.map(err => err.message).join(', '));
    }

    // Ensure data exists
    if (!data?.getRunList) {
        throw new Error('Failed to fetch run list: No data returned');
    }

    return data.getRunList;
};
