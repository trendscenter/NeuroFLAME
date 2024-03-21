import {startRun} from "./startRun";

const randomString = Math.random().toString(36).substring(7);

async function run() {
    await startRun({
        imageName: "boilerplate_average_app",
        userIds: ["user1", "user2"],
        consortiumId: "consortium1",
        runId: randomString,
        computationParameters: JSON.stringify({
            lambda: 0.1,
        })
    })
}

run();
