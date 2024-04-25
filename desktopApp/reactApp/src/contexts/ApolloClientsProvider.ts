import React, { useState, useEffect, ReactNode, FC } from 'react';
import ApolloClientsContext from './ApolloClientsContext';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { createApolloClient } from '../createApolloClient'; // Adjust this path as necessary

interface Props {
  config: {
    centralServerUrl: string;
    edgeClientUrl: string;
  };
  children: ReactNode;
}

const ApolloClientsProvider: FC<Props> = ({ children, config }) => {
  const [centralApiApolloClient, setCentralApiApolloClient] = useState<ApolloClient<NormalizedCacheObject>>();
  const [edgeClientApolloClient, setEdgeClientApolloClient] = useState<ApolloClient<NormalizedCacheObject>>();

  useEffect(() => {
    if (config) {
      setCentralApiApolloClient(createApolloClient({
        httpUrl: config.centralServerUrl,
        wsUrl: config.centralServerUrl,
        getAccessToken: () => localStorage.getItem('accessToken') || '',
      }));
      setEdgeClientApolloClient(createApolloClient({
        httpUrl: config.edgeClientUrl,
        wsUrl: config.edgeClientUrl,
        getAccessToken: () => localStorage.getItem('accessToken') || '',
      }));
    }
  }, [config]);

  return (
    <ApolloClientsContext.Provider value={{ centralApiApolloClient, edgeClientApolloClient }}>
      {children}
    </ApolloClientsContext.Provider>
  );
};

export default ApolloClientsProvider;
