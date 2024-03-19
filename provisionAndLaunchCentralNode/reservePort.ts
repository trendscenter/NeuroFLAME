import * as net from 'net';

// Function to reserve a port
function reservePort(port: number): Promise<net.Server> {
    return new Promise((resolve, reject) => {
        const server = net.createServer().listen(port, () => {
            console.log(`Reserved port ${port}`);
            resolve(server);
        });

        server.on('error', (err) => {
            reject(err);
        });
    });
}
