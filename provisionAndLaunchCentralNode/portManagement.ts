// portManagement.ts
import { createServer, Server } from 'net';
import * as portfinder from 'portfinder';

/**
 * Finds an open port.
 * @returns {Promise<number>} A promise that resolves with an open port number.
 */
export async function findOpenPort(): Promise<number> {
    portfinder.basePort = 8000; // Starting search range; adjust as needed.
    try {
        const port = await portfinder.getPortPromise();
        return port;
    } catch (error) {
        throw new Error('Unable to find an open port.');
    }
}

/**
 * Reserves a port by starting a temporary server.
 * @param {number} port The port to reserve.
 * @returns {Promise<Server>} A promise that resolves with the server instance.
 */
export async function reservePort(port: number): Promise<Server> {
    return new Promise((resolve, reject) => {
        const server = createServer();
        server.listen(port, () => {
            console.log(`Reserved port ${port}`);
            resolve(server);
        });
        server.on('error', (err) => {
            reject(err);
        });

        // Optional: Close the server on process exit
        process.on('exit', () => server.close());
        process.on('SIGINT', () => server.close()); // Catch Ctrl+C
    });
}
