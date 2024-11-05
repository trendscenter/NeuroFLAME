export const typeDefs = `type PublicUser {
  id: String!
  username: String!
}

type ConsortiumListItem {
  id: String!
  title: String!
  description: String!
  leader: PublicUser!
  members: [PublicUser!]!  # Non-nullable array and non-nullable items
}

type ComputationListItem {
  id: String!
  title: String!
  imageName: String!
}

input StartRunInput {
  consortiumId: String!
}

type RunStartCentralPayload {
  runId: String!
  imageName: String!
  userIds: [String!]!  # Non-nullable array and non-nullable items
  consortiumId: String!
  computationParameters: String!
}

type RunStartEdgePayload {
  runId: String!
  imageName: String!
  consortiumId: String!
  downloadUrl: String!
  downloadToken: String!
}

type StartRunOutput {
  runId: String!
}

type Computation {
  title: String!
  imageName: String!
  imageDownloadUrl: String!
  notes: String!
  owner: String!
}

type StudyConfiguration {
  consortiumLeaderNotes: String!
  computationParameters: String!
  computation: Computation
}

type ConsortiumDetails {
  id: String!
  title: String!
  description: String!
  leader: PublicUser!
  members: [PublicUser!]!  # Non-nullable array and non-nullable items
  activeMembers: [PublicUser!]!  # Non-nullable array and non-nullable items
  readyMembers: [PublicUser!]!  # Non-nullable array and non-nullable items
  studyConfiguration: StudyConfiguration!
}

type LoginOutput {
  accessToken: String!
  userId: String!
  username: String!
  roles: [String!]!  # Non-nullable array and non-nullable items
}

type RunEventPayload {
  consortiumId: String!
  consortiumTitle: String!
  runId: String!
  status: String!
  timestamp: String!
}

type RunListItem {
  consortiumId: String!
  consortiumTitle: String!
  runId: String!
  status: String!
  lastUpdated: String!
  createdAt: String!
}

type RunError {
  user: PublicUser!
  timestamp: String!
  message: String!
}

type RunDetails {
  runId: String!
  consortiumId: String!
  consortiumTitle: String!
  status: String!
  lastUpdated: String!
  createdAt: String!
  members: [PublicUser!]!  # Non-nullable array and non-nullable items
  studyConfiguration: StudyConfiguration!
  runErrors: [RunError!]!  # Non-nullable array and non-nullable items
}

type Query {
  getConsortiumList: [ConsortiumListItem!]!  # Non-nullable array and non-nullable items
  getComputationList: [ComputationListItem!]!  # Non-nullable array and non-nullable items
  getConsortiumDetails(consortiumId: String!): ConsortiumDetails!
  getComputationDetails(computationId: String!): Computation!
  getRunList(consortiumId: String): [RunListItem!]!  # Non-nullable array and non-nullable items
  getRunDetails(runId: String!): RunDetails!
}

type Mutation {
  login(username: String!, password: String!): LoginOutput!
  startRun(input: StartRunInput!): StartRunOutput!
  reportRunReady(runId: String!): Boolean!
  reportRunError(runId: String!, errorMessage: String!): Boolean!
  reportRunComplete(runId: String!): Boolean!
  reportRunStatus(runId: String!, status: String!): Boolean!
  studySetComputation(consortiumId: String!, computationId: String!): Boolean!
  studySetParameters(consortiumId: String!, parameters: String!): Boolean!
  studySetNotes(consortiumId: String!, notes: String!): Boolean!
  consortiumCreate(title: String!, description: String!): String!
  consortiumEdit(consortiumId: String!, title: String!, description: String!): Boolean!
  consortiumJoin(consortiumId: String!): Boolean!
  consortiumLeave(consortiumId: String!): Boolean!
  consortiumSetMemberActive(consortiumId: String!, active: Boolean!): Boolean!
  consortiumSetMemberReady(consortiumId: String!, ready: Boolean!): Boolean!
  computationCreate(title: String!, imageName: String!, imageDownloadUrl: String!, notes: String!): Boolean!
  computationEdit(computationId: String!, title: String!, imageName: String!, imageDownloadUrl: String!, notes: String!): Boolean!
  userCreate(username: String!, password: String!): LoginOutput!
  userChangePassword(password: String!): Boolean!
  adminChangeUserRoles(username: String!, roles: [String!]!): Boolean!
  adminChangeUserPassword(username: String!, password: String!): Boolean!
}

type Subscription {
  runStartCentral: RunStartCentralPayload!
  runStartEdge: RunStartEdgePayload!
  runEvent: RunEventPayload!
  consortiumLatestRunChanged(consortiumId: String!): String!
  consortiumDetailsChanged(consortiumId: String!): String!
  runDetailsChanged(runId: String!): String!
}
`;
