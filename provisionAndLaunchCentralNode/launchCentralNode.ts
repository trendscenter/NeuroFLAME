interface LaunchCentralNodeArgs {
    containerService: string;
    imageName: string;
    directoriesToMount: Array<{
        hostDirectory: string;
        containerDirectory: string;
    }>;
    portBindings: Array<{
        hostPort: number;
        containerPort: number;
    }>;
    commandsToRun: string[];
}

export function launchCentralNode({
    containerService,
    imageName,
    directoriesToMount,
    portBindings,
    commandsToRun
}: LaunchCentralNodeArgs) {
    if(containerService === "docker") {
        // Run the docker command
        console.log("Running docker command");
        dockerLaunch(imageName, directoriesToMount, portBindings, commandsToRun);
    }
    if(containerService === "singularity") {
        // Run the singularity command
        console.log("Running singularity command");
        singularityLaunch(imageName, directoriesToMount, portBindings, commandsToRun);
    }
}
