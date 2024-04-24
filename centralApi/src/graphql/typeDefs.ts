export interface StartRunInput {
  consortiumId: string
}

export interface StartRunOutput {
  runId: string
}

export interface runStartCentralPayload {
  runId: string
  imageName: string
  userIds: string[]
  consortiumId: string
  computationParameters: string
}

export interface runStartEdgePayload {
  runId: string
  imageName: string
  consortiumId: string
  downloadUrl: string
  downloadToken: string
}

export default `#graphql
  input StartRunInput {
    consortiumId: String
  }

  type RunStartCentralPayload {
    runId: String
    imageName: String
    userIds: [String]
    consortiumId: String
    computationParameters: String
  }

  type RunStartEdgePayload {
    runId: String
    imageName: String
    consortiumId: String
    downloadUrl: String
    downloadToken: String
  }

  type StartRunOutput {
    runId: String
  }

  type Query {
    _empty: String
  }

  type Mutation {
    startRun(input: StartRunInput): StartRunOutput
    reportReady(runId: String): Boolean
    reportError(runId: String, errorMessage: String): Boolean
    reportComplete(runId: String): Boolean
    reportStatus(runId: String, status: String): Boolean
  }

  type Subscription {
    runStartCentral: RunStartCentralPayload
    runStartEdge: RunStartEdgePayload
  }
`
