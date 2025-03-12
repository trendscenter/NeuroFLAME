## Developer Quick Start

1. Clone the repository.
2. Install dependencies at the top level:
   ```bash
   npm i
   ```
3. Initialize configuration:
   ```bash
   cd configs && ./initialize_configs.sh
   ```
4. Launch the database container:
   ```bash
   cd _devCentralDatabase && docker-compose up
   ```
5. Build the Edge Federated Client package:
   ```bash
   cd edgeFederatedClient && npm run build
   ```
6. Seed the database:
   ```bash
   cd centralApi && npm run seed
   ```
7. Open multiple terminals and run the following commands in each:
   - Central API:
     ```bash
     cd centralApi && npm run start-configured
     ```
   - Central Federated Client:
     ```bash
     cd centralFederatedClient && npm run start-configured
     ```
   - File Server:
     ```bash
     cd fileServer && npm run start-configured
     ```
   - Desktop App (React):
     ```bash
     cd desktopApp/reactApp && npm run start
     ```
   - Desktop App (Electron):
     ```bash
     cd desktopApp/electronApp && npm run start-configured
     ```