import { validateToken } from '../auth/validateToken.js'

// WebSocket server context
export const wsServerContext = async (ctx: any) => {
  const { accessToken } = ctx.connectionParams
  const tokenPayload = await validateToken(accessToken)
  const context = tokenPayload
  return context
}

type BaseContext = {
  accessToken?: string
  tokenPayload?: TokenPayload
}

type TokenPayload = {
  userId?: string
  roles?: string[]
}

export const httpServerContext = async ({
  req,
  res,
}: {
  req: any
  res: any
}): Promise<BaseContext> => {
  const accessToken = req.headers['x-access-token']?.replace(/^null$/, '')
  const tokenPayload = await validateToken(accessToken)
  return {
    accessToken,
    tokenPayload,
  }
}
