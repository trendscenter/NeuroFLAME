interface Context {
  userId: string
}

interface StartRunInput {
  imageName: string
  userIds: string[]
  consortiumId: string
  computationParameters: string
}

interface StartRunOutput {
  runId: string
}

export default {
  Mutation: {
    startRun: async (
      _,
      { input }: { input: StartRunInput },
      context,
    ): Promise<StartRunOutput> => {
      // is this user authorized?
      // is this a valid user
      // is this user an admin of the consortium they are trying to run?

      // generate a runId
      // create a run in the database
      const runId = '1234'

      // await call to provision run

      // emit a start run event

      return { runId }
    },
  },
}
