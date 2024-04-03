
# System Run Initiation and Monitoring Process

# TODO: change this document to reflect the provisioning step happening outside of the central client

## Introduction

This document outlines the sequential process and interactions within the system, initiated by a consortium lead's action to start a run. It describes the flow from triggering a run in the UI, through the central client's provisioning and startup, to the edge clients beginning their operations. Furthermore, it details the error reporting and status update mechanisms.

## Process Overview

1. **Initiation by Consortium Lead**
   - The consortium lead initiates a run via the UI by clicking the "Start Run" button.
   - This action calls the `startRun` endpoint in the central API.

2. **Central API to Central Client Communication**
   - Upon receiving the start request, the central API emits a `CentralClientStartRun` event to the central client.

3. **Central Client Actions**
   - The central client responds to the `CentralClientStartRun` event by:
     - Provisioning the project.
     - Making runKits available for download.
     - Acquiring its own runKit.
     - Launching its central node and associated container.

4. **Reporting Run Initiation**
   - Once the central client has successfully launched its central node and container, it reports back to the central API by making a request to the `reportRunStartedCentral` endpoint.

5. **Notification to Edge Clients**
   - The central API, upon receiving the run initiation report from the central client, emits an `EdgeClientStartRun` event to all edge clients.
   - Edge clients, upon receiving this event, download their runKits and start their runs.

## Error Reporting and Status Updates

- **During Startup or Run**: If the edge client or central client encounters any errors during their startup processes or over the course of their runs, they report these errors back to the central API using `reportErrorCentral` for the central client and `reportErrorEdge` for edge clients.

- **Run Status Updates**: The central client may report the status of the run to the central API using the `reportStatusCentral` endpoint. This allows for continuous monitoring and management of the run's progress.

## Key Considerations

- **Scalability**: The system is designed to efficiently manage multiple runs and scale dynamically to handle varying loads, ensuring that all components can communicate and operate effectively.

- **Reliability and Robustness**: Robust error handling and status reporting mechanisms are critical for maintaining system integrity and operational transparency.

- **Security**: Secure communications and authentications between components protect sensitive data and operations from unauthorized access.

## Conclusion

The outlined process ensures a coherent and systematic approach to initiating, monitoring, and managing runs within the system. By clearly defining the roles and interactions of the central and edge clients, as well as the mechanisms for error reporting and status updates, the system aims to achieve high levels of efficiency, reliability, and user satisfaction.