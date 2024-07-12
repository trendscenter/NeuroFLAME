export interface StartRunInput {
  consortiumId: string
}

export interface StartRunOutput {
  runId: string
}

export interface RunStartCentralPayload {
  runId: string
  imageName: string
  userIds: string[]
  consortiumId: string
  computationParameters: string
}

export interface RunStartEdgePayload {
  runId: string
  imageName: string
  consortiumId: string
  downloadUrl: string
  downloadToken: string
}

export interface PublicUser {
  id: string
  username: string
}

export interface ConsortiumListItem {
  title: string
  description: string
  leader: PublicUser
  members: PublicUser[]
}

export interface ComputationListItem {
  id: string
  title: string
  imageName: string
}

export interface Computation {
  title: string
  imageName: string
  imageDownloadUrl: string
  notes: string
  owner: string
}

export interface StudyConfiguration {
  consortiumLeaderNotes: string
  computationParameters: string
  computation?: Computation
}

export interface ConsortiumDetails {
  id: string
  title: string
  description: string
  leader: PublicUser
  members: PublicUser[]
  activeMembers: PublicUser[]
  studyConfiguration: StudyConfiguration
}

export interface LoginOutput {
  accessToken: string
  userId: string
  username: string
  roles: string[]
}

export interface RunEventPayload {
  consortiumId: string
  consortiumTitle: string
  runId: string
  status: string
  timestamp: string
}

export interface RunListItem {
  consortiumId: string
  consortiumTitle: string
  runId: string
  status: string
  lastUpdated: string
}

export interface RunDetails {
  runId: string
  consortiumId: string
  consortiumTitle: string
  status: string
  lastUpdated: string
  members: PublicUser[]
  studyConfiguration: StudyConfiguration
}

export default `#graphql
  type PublicUser {
    id: String
    username: String
  }

  type ConsortiumListItem {
    id: String
    title: String
    description: String
    leader: PublicUser
    members: [PublicUser]
  }

  type ComputationListItem {
    id: String
    title: String
    imageName: String
  }
  
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

  type Computation {
    title: String
    imageName: String
    imageDownloadUrl: String
    notes: String
    owner: String
  }

  type StudyConfiguration {
    consortiumLeaderNotes: String
    computationParameters: String
    computation: Computation
  }

  type ConsortiumDetails {
    id: String
    title: String
    description: String
    leader: PublicUser
    members: [PublicUser]
    activeMembers: [PublicUser]
    studyConfiguration: StudyConfiguration
  }

  type LoginOutput {
    accessToken: String
    userId: String
    username: String
    roles: [String]
  }

  type RunEventPayload {
    consortiumId: String
    consortiumTitle: String
    runId: String
    status: String
    timestamp: String
  }

  type RunListItem {
    consortiumId: String
    consortiumTitle: String
    runId: String
    status: String
    lastUpdated: String
  }

  type RunDetails {
    runId: String
    consortiumId: String
    consortiumTitle: String
    status: String
    lastUpdated: String
    members: [PublicUser]
    studyConfiguration: StudyConfiguration
  }

  type Query {
    getConsortiumList: [ConsortiumListItem]
    getComputationList: [ComputationListItem]
    getConsortiumDetails(consortiumId: String): ConsortiumDetails
    getComputationDetails(computationId: String): Computation
    getRunList: [RunListItem]
    getRunDetails(runId: String): RunDetails
  }

  type Mutation {
    login(username: String, password: String): LoginOutput
    startRun(input: StartRunInput): StartRunOutput
    reportRunReady(runId: String): Boolean
    reportRunError(runId: String, errorMessage: String): Boolean
    reportRunComplete(runId: String): Boolean
    reportRunStatus(runId: String, status: String): Boolean
    studySetComputation(consortiumId: String, computationId: String): Boolean
    studySetParameters(consortiumId: String, parameters: String): Boolean
    studySetNotes(consortiumId: String, notes: String): Boolean
    consortiumCreate(title: String, description: String): Boolean
    consortiumEdit(consortiumId: String, title: String, description: String): Boolean
    consortiumJoin(consortiumId: String): Boolean
    consortiumLeave(consortiumId: String): Boolean
    consortiumSetMemberActive(consortiumId: String, active: Boolean): Boolean
    computationCreate(title: String, imageName: String, imageDownloadUrl: String, notes: String): Boolean
    computationEdit(computationId: String, title: String, imageName: String, imageDownloadUrl: String, notes: String): Boolean
    userCreate(username: String, password: String): LoginOutput
    userChangePassword(password: String): Boolean
    adminChangeUserRoles(username: String, roles: [String]): Boolean
    adminChangeUserPassword(username: String, password: String): Boolean
  }

  type Subscription {
    runStartCentral: RunStartCentralPayload
    runStartEdge: RunStartEdgePayload
    runEvent: RunEventPayload
  }
`
