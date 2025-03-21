# **Developer Guide**

## **Prerequisites**
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (latest LTS version recommended)
- [Docker](https://www.docker.com/)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

Refer to:
- 📖 [Overview of System Components](./overview-system-components.md)
- 📖 [Architecture and Design](./architecture-and-design.md)

---

## **Developer Quick Start**
Follow these steps to set up and run the development environment.

### **1. Clone the Repository**
```bash
git clone https://github.com/NeuroFlame/NeuroFLAME.git
cd NeuroFLAME
```

### **2. Initialize Configuration**
Run the configuration initialization script:
```bash
cd configs && ./initialize_configs.sh
```

### **3. Start the Database**
Launch the database container using Docker Compose:
```bash
cd _devCentralDatabase && docker compose up -d
```

### **4. Build the Edge Federated Client Package**
```bash
cd edgeFederatedClient && npm i && npm run build
```

### **5. Seed the Database**
Run the seeding script to populate the database with test data:
```bash
cd centralApi && npm i && npm run seed
```

### **6. Start the Services**
Open multiple terminal windows and run the following commands in each:

#### **Central API**
```bash
cd centralApi && npm i && npm run start-configured
```

#### **Central Federated Client**
```bash
cd centralFederatedClient && npm i && npm run start-configured
```

#### **File Server**
```bash
cd fileServer && npm i && npm run start-configured
```

#### **Desktop App (React)**
```bash
cd desktopApp/reactApp && npm i && npm run start
```

#### **Desktop App (Electron)**
```bash
cd desktopApp/electronApp && npm i && npm run start-configured
```

