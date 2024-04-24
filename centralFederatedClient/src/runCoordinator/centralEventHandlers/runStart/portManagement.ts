import net from 'net';

interface ReservePortResult {
  port: number;
  server: net.Server;
}

export async function reservePort(): Promise<ReservePortResult> {
  return new Promise((resolve, reject) => {
    const server = net.createServer((sock) => {
      sock.end('Hello world\n');
    });

    server.listen(0, () => {
        const address = server.address() as net.AddressInfo;
        const port = address.port;
        console.log(`Listening on port ${port}`);
        
        resolve({
            port,
            server
        });
    });

    server.on('error', (err) => {
        reject(err);
    });
  });
}
