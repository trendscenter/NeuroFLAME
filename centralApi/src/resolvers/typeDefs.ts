export default `#graphql
  input StartRunInput {
    imageName: String
    userIds: [String]
    consortiumId: String
    computationParameters: String
  }

  type StartRunOutput {
    runId: String
  }


  type Query {
    _empty: String
  }

  type Mutation {
    startRun(input: StartRunInput): StartRunOutput
  }
`
