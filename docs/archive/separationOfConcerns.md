**Separation of Concerns in COINSTAC: A Guide for Computation Authors, Platform Developers, and Users**

A clear separation of concerns between the COINSTAC platform and computation code is beneficial to computation authors, platform developers, and users.

### COINSTAC Platform Responsibilities:
- **Run Preparation and Execution:** The platform is responsible for preparing runs and launching containers that form the federated networks on which the computation code runs.
- **Error Reporting:** The platform reports errors that arise from:
  - Failure to prepare the run.
  - Failure to launch containers for nodes.
  - Containers exiting with an error code.

The central client reports a run as 'complete' if the container for the central node of a run exits without an error code, even if errors occurred within the computation itself.

### Computation Code Responsibilities:
- **Computation-Internal Handling:** Error handling, logging, and diagnostics not related to the core platform operations are the responsibility of the computation code.
- **Input Validation:** The computation code should validate input parameters and data.
- **Effective Error Management:** It should also handle and log errors effectively.

### Validation Workflow Example:
The following is an example of how input validation can be included in a computation:

1. **Validation Steps:**
   - Is `parameters.json` formatted correctly with valid values?
   - Do all sites have identical column names?
   - Do all sites share the Regions of Interest (ROIs) specified by the study?
   - Do any sites have rows with missing data?

2. **Workflow Execution:**
   - The computation workflow executes tasks that perform these validation checks.
   - If a check fails, the workflow continues with the subsequent checks until all are completed.
   - The workflow then generates and saves validation report files for both study-wide validation and private local validation.

3. **Graceful Exit:**
   - If a validation check fails, after completing all validation checks and generating reports, the workflow controller gracefully exits the computation.
     - The run is marked as complete, and members can view the files in the run’s results folder to diagnose and troubleshoot any errors in their data or study configuration.
   - If no validation checks fail, the workflow continues using the core computation.

### Importance of Separation:
This separation of concerns is a fundamental aspect of the COINSTAC system design, enabling the platform to effectively support a wide range of federated analysis projects.

### Collaboration and System Evolution:
The COINSTAC team continuously develops tools, design patterns, and conventions to assist computation authors. The platform development team can leverage their software development expertise to advise computation authors on designing computations that best utilize the COINSTAC platform. Although the platform may evolve through this collaborative process, understanding the separation of functional responsibilities within the system is essential.

While maintaining clear separation between components is critical, cross-domain collaboration among team members is both encouraged and beneficial.