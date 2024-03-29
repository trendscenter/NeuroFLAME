**This process depends on NVFLARE projects being provisioned per run.**


```
runs/[consortiumId]/[runId]/
	startupKits/
	    Project.yaml
	    [site1id]/
	    [site2id]/
	    admin@admin.com/
	    host.docker.internal/
	runKits/
		central/
        	admin/
	    	server/
	    	parameters.json
		[site1id]/
		[site2id]/
    hosting/
        [site1id].zip
        [site2id].zip
		central.zip
```

**Run provision**
* Generate startup kits
* Save `parameters.json`
* Create zips of site files in the host directory
* Moves run kit files into the run_kit directory
* Host the files

**Central node startup**

* Launch the container with the following details
	* mount the runKit directory
	* commands
		* start server
		* submit job

**Site startup**
* Receive start signal with the kit download link
* Download the kit to the local run directory
* unzip the kit into the local run directory