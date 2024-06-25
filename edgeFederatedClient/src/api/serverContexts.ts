import { getConfig } from '../config/config.js'

export const wsServerContext = async (ctx: any) => {
  const { accessToken } = ctx.connectionParams
  const tokenPayload = await validateToken(accessToken)
  const context = tokenPayload
  return context
}

type BaseContext = {
  accessToken?: string
  tokenPayload?: tokenPayload
}

type tokenPayload = {
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
  } // Ensure it matches the BaseContext structure
}

const validateToken = async (accessToken: string): Promise<tokenPayload> => {
  const { authenticationEndpoint } = await getConfig()
  try {
    const response = await fetch(authenticationEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: accessToken }),
    })
    const { decodedAccessToken } = (await response.json()) as {
      decodedAccessToken: tokenPayload
    }
    return decodedAccessToken
  } catch (e: any) {
    console.error('Failed to validate access token:', e.message)
    return {}
  }
}
