## UI

The following endpoints are available from the UI to facilitate user interaction and system management:

- `login`: Log in to the system.
- `create-account`: Create a new account.
- `change-password`: Change an account's password.
- `create-consortium`: Create a new consortium.
- `join-consortium`: Join an existing consortium.
- `accept-member`: Accept a new member into the consortium.
- `remove-member`: Remove a member from the consortium.
- `set-study-details`: Set or update study details.
- `start-run`: Start a new run.
- `stop-run`: Stop an ongoing run.

## Edge client

### Subscribe to Run Events

Edge clients can subscribe to the following run events:

- `start-run`: Notification of a run starting.
- `stop-run`: Notification of a run stopping.

###  Mutations

Edge clients can perform the following mutations:

- `report-error`: Report an error encountered during operations.

## Central client

### Subscribe to Run Events

start and stop run are events that go to a component that controls the lifecycle of the container, not the container itself.

Central clients can subscribe to the same run events as Edge clients:

- `start-run`: Notification of a run starting.
- `stop-run`: Notification of a run stopping.

### Mutations

Central clients can perform the following mutations:

- `send-run-status`: Send the status of the current run.
- `report-error`: Report an error encountered during operations.

## Provisioner Process

If the Provisioner operates as a separate process, it interacts with the system through the following API endpoints:

- `start-run`: Receives a call or event to start a run.
- `report-error`: Reports any errors encountered during the provisioning process or before the central client becomes operational.

If the provisioner process is a function call to the local system, then it doesn't need to interact through the API and can simply throw an error.