# Computation/COINSTAC Interface Requirements

## Containerization
- The computation must be contained in a Singularity or Docker image.

## Directory Mounts
- COINSTAC will mount the following directories to the container with appropriate read/write permissions:
  - `/workspace/provision/`
  - `/workspace/runKit/`
  - `/workspace/data/`
  - `/workspace/results/`
  - `/workspace/logs/`

## Container Commands
- The container must provide commands for the following functions, ensuring they can accept necessary arguments and environment variables:
  - `start_edge`
  - `start_central`
  - `start_provision`

  Example commands:
  ```bash
  python entry_edge.py
  python entry_central.py
  python entry_provision.py
  ```

## COINSTAC Convention: Provisioning Run Kits
- A set of run kits corresponding to each node are created in the provision step and placed into the `/workspace/provision/` directory.
- A runKit is a folder containing the files necessary to start a run for each client, distributed to each site and the central node.
- The central node's run kit must contain a `parameters.json` file that the computation code consumes to set this run's parameters.

### Run Kit Structure
- Each run kit should include:
  - Any files required for the computation to execute properly for the given site.
- The central node's run kit will additionally include:
  - `parameters.json` to specify the parameters for the run.