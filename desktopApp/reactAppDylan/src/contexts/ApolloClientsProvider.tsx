import React, { useState, useEffect, ReactNode } from 'react'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { createApolloClient } from '../createApolloClient'
import { ApolloClientsContext } from './ApolloClientsContext' // Ensure this path is correct

interface Props {
  config: {
    centralServerUrl: string
    edgeClientUrl: string
  }
  children: ReactNode
}

const ApolloClientsProvider: React.FC<Props> = ({ children, config }) => {
  const [centralApiApolloClient, setCentralApiApolloClient] = useState<
    ApolloClient<NormalizedCacheObject>
  >()
  const [edgeClientApolloClient, setEdgeClientApolloClient] = useState<
    ApolloClient<NormalizedCacheObject>
  >()

  useEffect(() => {
    console.log("creating centralApiApolloClient", config.centralServerUrl)
    setCentralApiApolloClient(
      createApolloClient({
        httpUrl: config.centralServerUrl,
        wsUrl: config.centralServerUrl,
        getAccessToken: () => localStorage.getItem('accessToken') || '',
      }),
    )
    console.log("creating edgeClientApolloClient", config.edgeClientUrl)
    setEdgeClientApolloClient(
      createApolloClient({
        httpUrl: config.edgeClientUrl,
        wsUrl: config.edgeClientUrl,
        getAccessToken: () => localStorage.getItem('accessToken') || '',
      }),
    )
  }, [config])

  if(!centralApiApolloClient || !edgeClientApolloClient) {
    return <div>Loading...</div>
  }

  return (
    <ApolloClientsContext.Provider value={{ centralApiApolloClient, edgeClientApolloClient }}>
      {children}
    </ApolloClientsContext.Provider>
  );
}

export default ApolloClientsProvider
