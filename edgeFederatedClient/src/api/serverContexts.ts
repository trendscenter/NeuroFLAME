import axios from 'axios';
import { getConfig } from '../config/config.js';
import logger from '../logger.js';

// WebSocket server context
export const wsServerContext = async (ctx: any) => {
  const { accessToken } = ctx.connectionParams;
  const tokenPayload = await validateToken(accessToken);
  const context = tokenPayload;
  return context;
};

// Define types for context and token payload
type BaseContext = {
  accessToken?: string;
  tokenPayload?: TokenPayload;
};

type TokenPayload = {
  userId?: string;
  roles?: string[];
};

// HTTP server context
export const httpServerContext = async ({
  req,
  res,
}: {
  req: any;
  res: any;
}): Promise<BaseContext> => {
  // Extract the access token from the request headers
  const accessToken = req.headers['x-access-token']?.replace(/^null$/, '');
  // Validate and decode the access token
  const tokenPayload = await validateToken(accessToken);
  return {
    accessToken,
    tokenPayload,
  }; // Ensure it matches the BaseContext structure
};

// Validate token by hitting the authentication endpoint
const validateToken = async (accessToken: string): Promise<TokenPayload> => {
  const { authenticationEndpoint } = await getConfig();
  try {
    const response = await axios.post(authenticationEndpoint, {
      token: accessToken,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { decodedAccessToken } = response.data as {
      decodedAccessToken: TokenPayload;
    };
    return decodedAccessToken;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(`Axios error: ${error.message}`, error.response?.data);
      throw new Error(`Error fetching decoded token: ${error.response?.statusText || error.message}`);
    } else {
      logger.error(`Unexpected error: ${error}`);
      throw new Error(`Unexpected error fetching decoded token: ${error}`);
    }
  }
};
