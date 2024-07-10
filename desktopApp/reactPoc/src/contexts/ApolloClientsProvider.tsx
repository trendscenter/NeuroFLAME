import React, { useState, useEffect, ReactNode } from 'react'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { createApolloClient } from '../createApolloClient'
import { ApolloClientsContext } from './ApolloClientsContext' // Ensure this path is correct
import { useUserState } from './UserStateContext'

interface Props {
  config: {
    centralServerQueryUrl: string;
    centralServerSubscriptionUrl: string;
    edgeClientQueryUrl: string;
    edgeClientSubscriptionUrl: string;
  }
  children: ReactNode
}

const ApolloClientsProvider: React.FC<Props> = ({ children, config }) => {
  const { getAccessToken } = useUserState()
  const [centralApiApolloClient, setCentralApiApolloClient] = useState<
    ApolloClient<NormalizedCacheObject>
  >()
  const [edgeClientApolloClient, setEdgeClientApolloClient] = useState<
    ApolloClient<NormalizedCacheObject>
  >()

  useEffect(() => {
    console.log(config)
    console.log("creating centralApiApolloClient", config.centralServerQueryUrl)
    setCentralApiApolloClient(
      createApolloClient({
        httpUrl: config.centralServerQueryUrl,
        wsUrl: config.centralServerSubscriptionUrl,
        getAccessToken: getAccessToken
      }),
    )
    console.log("creating edgeClientApolloClient", config.edgeClientQueryUrl)
    setEdgeClientApolloClient(
      createApolloClient({
        httpUrl: config.edgeClientQueryUrl,
        wsUrl: config.edgeClientSubscriptionUrl,
        getAccessToken: getAccessToken
      }),
    )
  }, [config, getAccessToken])

  if (!centralApiApolloClient || !edgeClientApolloClient) {
    return <div>Loading...</div>
  }

  return (
    <ApolloClientsContext.Provider value={{ centralApiApolloClient, edgeClientApolloClient }}>
      {children}
    </ApolloClientsContext.Provider>
  );
}

export default ApolloClientsProvider
