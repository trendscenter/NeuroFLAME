export const defaultConfig = {
  centralServerUrl: 'http://localhost:4000/graphql',
  edgeClientUrl: 'http://localhost:4001/graphql',
  startEdgeClientOnLaunch: true,
  edgeClientConfig: {
    httpUrl: 'http://localhost:4000/graphql',
    wsUrl: 'ws://localhost:4000/graphql',
    path_base_directory:
      'C:\\development\\effective-palm-tree\\_devTestDirectories\\edgeSite1',
    authenticationEndpoint: 'http://localhost:4000/authenticateToken',
    hostingPort: 9000,
  },
}
