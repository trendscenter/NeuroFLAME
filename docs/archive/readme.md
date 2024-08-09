# System Design Documentation Overview

This document outlines the system's architecture, focusing on user roles, actions, security, core components, and workflow. It aims to provide a clear and organized view of the system's functionalities and the steps needed for development.

## User Roles and Permissions

### Roles

1. **Non-Logged-In User**
   - **Actions**:
     - Log in
     - Create user

2. **Logged-In User**
   - **Actions**:
     - Create consortium
     - Join consortium

3. **Consortium Member**
   - **Actions**:
     - Download kit
     - View job configuration:
       - Notes
       - Parameters
       - Image to be used

4. **Consortium Lead**
   - **Actions**:
     - Invite member
     - Cancel invite
     - Remove member
     - Set job configuration:
       - Notes
       - Parameters
       - Image to be used
     - Start run

### Security and Access Control

- **Non-Logged-In Users** can only access login and user creation endpoints.
- **Logged-In Users** can create or join consortiums but cannot access consortium-specific actions without membership.
- **Consortium Members** can view but not modify data.
- **Consortium Leads** have full access to management, modification, and operation actions.

Authentication is managed through JWTs, with authorization checks at each endpoint.

## System Configuration

### Client Local Settings

- App-wide settings include the base directory for consortia/run directories.
- Consortium-specific settings include the data path to mount.

## Core Components

1. **Apollo API**
   - Facilitates user management, consortium operations, and file distribution.

2. **Authentication Service**
   - Authenticates tokens.

3. **Computation Job Management**
   - Coordinates lifecycles of containers, servers, and the jobs to run.
   - Boots up and connects the network
   - Submits jobs
   - Shutsdown network on job completion

4. **Database**
   - Stores users, consortia, and run information.
   - Uses MongoDB.

5. **File System**
   - provides a workspace for generating and zipping run kits
   - provides run specific results directory to be mounted

6. **File Hosting API**
   - Distributes startup kits and necessary files to consortium members securely.

7. **Reverse Proxy/Broker TBD**
   - Directs communication between components of federated analysis projects to and from the respective servers, managing traffic for multiple projects simultaneously over a shared external endpoint.

## Development Roadmap

1. **Technical Specification Document**
   - Detail APIs, data models, and interaction flows.

2. **Prototype Development**
   - Focus on core functionalities: user management, consortium operations, and file distribution.

3. **Feedback Loop**
   - Test with users, gather feedback, and iterate on design and implementation.