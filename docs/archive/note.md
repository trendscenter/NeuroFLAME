# Project Notes

## Consortium and Flare Project Integration
- A consortium has a corresponding flare project.
- Members get added and removed simultaneously from consortia and the respective projects.

## Process Sequence

### Members:
- Download their kits.

### Leads:
- Configure a job:
  - Specify computation parameters.
  - Specify the image to use.

### Members:
- Download the image.
- Specify the data path to mount.

### Leads:
- Launch the flare project containers and components.
- Submit the job.

## Infrastructure Considerations
- Maybe we skip the reverse proxy for now.
- Maybe we just let the flare servers be on different ports?

## Development Needs
- We need the central platform and a client side app that can interact with the central platform and the local system.

## Client Side Application Features
- UI
- Create directories structure for consortia/runs
- Save configurations:
  - Data mount path per consortium
- Trigger image downloads
- Manage containers
