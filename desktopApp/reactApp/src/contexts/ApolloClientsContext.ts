import React, { createContext, useContext, Context } from 'react';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

// Define the type for the context state
interface ApolloClientsContextType {
  centralApiApolloClient?: ApolloClient<NormalizedCacheObject>;
  edgeClientApolloClient?: ApolloClient<NormalizedCacheObject>;
}

// Create and export the context
const ApolloClientsContext = createContext<ApolloClientsContextType>({});

// Custom hook for using the Apollo clients context
export const useApolloClients = () => useContext(ApolloClientsContext);

export default ApolloClientsContext;
