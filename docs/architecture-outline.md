**COINSTAC Architecture Outline Including NVFLARE**

The COINSTAC platform consists of several components:
1. Central API
2. Central File Server
3. Edge Federated Client
4. Central Federated Client
5. Desktop Application

**Central API:**
- Facilitates user actions such as creating, joining, and leaving consortia, configuring studies, starting runs, and viewing results.
- Emits events to the edge clients and central client, instructing them to launch or stop containers.
- Provides endpoints for the central and edge clients to report run events.

**Edge Federated Client and Central Federated Client:**
- Launch containers configured for the corresponding runs.
- Report run events to the central API.

**Containers:**
- Launched by the edge and central clients.
- Use NVFLARE to create and communicate on a secure network specific to each run.

**Central File Server:**
- Securely distributes files that each node needs to start a run.

**Desktop Application:**
- Provides a GUI for:
  - Creating and joining consortia
  - Configuring studies
  - Executing runs
  - Monitoring and viewing results
- Communicates with the central API and the site's corresponding edge client.

**NVFLARE:**
- Runs inside the computation containers.
- Handles the provisioning of secure networks and communication between nodes.
- Provides a rich library of tools for computation authors to develop their computations.