export interface StartRunInput {
  consortiumId: string;
}

export interface StartRunOutput {
  runId: string;
}

export interface RunStartCentralPayload {
  runId: string;
  imageName: string;
  userIds: string[];
  consortiumId: string;
  computationParameters: string;
}

export interface RunStartEdgePayload {
  runId: string;
  imageName: string;
  consortiumId: string;
  downloadUrl: string;
  downloadToken: string;
}

export interface PublicUser {
  id: string;
  username: string;
}


export interface ConsortiumListItem {
  title: string;
  description: string;
  leader: PublicUser;
  members: PublicUser[];
}

export interface ComputationListItem {
  id: string;
  title: string;
  imageName: string;
}

export interface Computation {
  title: string;
  imageName: string;
  imageDownloadUrl: string;
  notes: string;
  owner: string;
}

export interface StudyConfiguration {
  consortiumLeaderNotes: string;
  computationParameters: string;
  computation: Computation;
}

export interface ConsortiumDetails {
  title: string;
  description: string;
  leader: PublicUser;
  members: PublicUser[];
  activeMembers: PublicUser[];
  studyConfiguration: StudyConfiguration;
}

export interface LoginOutput {
  accessToken: string;
  userId: string;
  username: string;
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
  }

  type Query {
    getConsortiumList: [ConsortiumListItem]
    getComputationList: [ComputationListItem]
    getConsortiumDetails(consortiumId: String): ConsortiumDetails
  }

  type Mutation {
    login(username: String, password: String): LoginOutput
    startRun(input: StartRunInput): StartRunOutput
    reportRunReady(runId: String): Boolean
    reportError(runId: String, errorMessage: String): Boolean
    reportComplete(runId: String): Boolean
    reportStatus(runId: String, status: String): Boolean
    studySetComputation(consortiumId: String, computationId: String): Boolean
    studySetParameters(consortiumId: String, parameters: String): Boolean
    studySetNotes(consortiumId: String, notes: String): Boolean
  }

  type Subscription {
    runStartCentral: RunStartCentralPayload
    runStartEdge: RunStartEdgePayload
  }
`;
