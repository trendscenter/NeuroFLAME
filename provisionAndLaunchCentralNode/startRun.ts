import path from "path";
import { generateProjectFile } from "./generateProjectFile";
import { createKits } from "./createKits";

interface StartRunArgs{
    imageName: string
    userIds: string[]
    consortiumId: string,
    runId: string
}

export function startRun({
    imageName, userIds, consortiumId, runId
}: StartRunArgs) {
    console.log("Running startRun command");

    const baseDirectory = "/baseDirectory"
    const runDirectory = path.join(baseDirectory, "runs", consortiumId, runId);

    generateProjectFile({
        projectName: "project",
        FQDN: "test",
        fed_learn_port: 80,
        admin_port: 80,
        outputFilePath: path.join(runDirectory, "Project.yml"),
        siteNames: ["site1", "site2","site3"]
    })

    createKits({
        projectFilePath: path.join(runDirectory, "Project.yml"),
        outputDirectory: path.join(runDirectory, "kits")
    })
}