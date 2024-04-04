import { validateAccessToken } from './authentication.js';
/**
 * Generate context from an access token.
 * @param {string} accessToken - Access token
 * @returns {object|null} - Context containing the user
 */
const getContextFromToken = (accessToken) => {
    try {
        const decodedAccessToken = validateAccessToken(accessToken);
        return { user: { id: decodedAccessToken.user.id } };
    }
    catch (e) {
        // Optionally log the error
        return null;
    }
};
/**
 * Generate WebSocket server context.
 * @param {object} ctx - Context
 * @returns {object|null} - Context containing the user
 */
const wsServerContext = (ctx) => {
    const { accessToken } = ctx.connectionParams;
    const context = getContextFromToken(accessToken);
    return context;
};
/**
 * Generate HTTP server context.
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @returns {object|null} - Context containing the user
 */
const httpServerContext = async ({ req, res }) => {
    const accessToken = req.headers['x-access-token']?.replace(/^null$/, '');
    const context = getContextFromToken(accessToken);
    return context;
};
export { wsServerContext, httpServerContext };
