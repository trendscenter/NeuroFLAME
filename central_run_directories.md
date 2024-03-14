**This process depends on NVFLARE projects being provisioned per run.**


```
runs/[consortiumId]/[runId]/
	provision/
	    project.yaml
	    [site1id]/
	    [site2id]/
	    server/
	    admin/
	    parameters.json
    host/
        [site1id]/kit.zip/
        [site2id]/kit.zip/
    run_kit/
        admin@admin/
	    server/
	    parameters.json
	results/
```

**Run provision**
* Generate startup kits
* Save `parameters.json`
* Create zips of site files in the host directory
* Moves run kit files into the run_kit directory
* Host the files

**Central node startup**

* Launch the container with the following details
	* mount the run_kit directory
	* commands
		* start server
		* submit job

**Site startup**
* Receive start signal with the kit download link
* Download the kit to the local run directory
* unzip the kit into the local run directory