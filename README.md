# COINSTAC-MINT

**COINSTAC-MINT** (**Modular Infrastructure for Next-gen Technologies**) is a decentralized platform for running computations across multiple sites while preserving data privacy. Its modular design, scalability, and ease of use make it a powerful tool for collaborative research in neuroimaging and other fields.

## Key Features

- **Modular Architecture**: Built to support a wide range of use cases, COINSTAC-MINT’s modular infrastructure allows for easy expansion and customization.
- **Flexibility**: Suitable for various research needs, from single-site studies to multi-site collaborations.
- **Reliability**: A focus on ensuring smooth operation across diverse environments, with clear error handling and logging.
- **User-Friendly Interface**: Designed for ease of use, allowing researchers to focus on their work without unnecessary complexity.
- **Reproducibility**: Study configurations are captured and preserved, ensuring results can be easily replicated.
- **Transparency and Control**: Users have full visibility into their computations, inputs, and results.

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
   cd _devCentralDatabase/ && docker-compose up
   ```

5. Open multiple terminals and run the following commands in each:
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