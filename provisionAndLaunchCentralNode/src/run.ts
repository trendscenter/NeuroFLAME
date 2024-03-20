import {startRun} from "./startRun";

async function run() {
    await startRun({
        imageName: "nvflare-pt",
        userIds: ["user1", "user2"],
        consortiumId: "consortium1",
        runId: "run1",
        computationParameters: JSON.stringify({
            lambda: 0.1,
        })
    })
}

run();
