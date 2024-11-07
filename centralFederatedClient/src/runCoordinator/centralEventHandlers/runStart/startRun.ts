import path from 'path';
import { provisionRun } from './provisionRun/provisionRun.js';
import { reservePort } from './portManagement.js';
import { launchNode } from './launchNode.js';
import uploadToFileServer from './uploadToFileServer.js';
import getConfig from '../../../config/getConfig.js';
import reportRunError from './reportRunError.js';
import reportRunComplete from './reportRunComplete.js';
import { logger } from '../../../logger.js';

interface StartRunArgs {
  imageName: string;
  userIds: string[];
  consortiumId: string;
  runId: string;
  computationParameters: string;
}

export default async function startRun({
  imageName,
  userIds,
  consortiumId,
  runId,
  computationParameters,
}: StartRunArgs) {
  logger.info(`Starting run ${runId} for consortium ${consortiumId}`);

  const config = await getConfig();
  const path_baseDir = config.baseDir;
  const path_run = path.join(path_baseDir, 'runs', consortiumId, runId);
  const path_centralNodeRunKit = path.join(path_run, 'runKits', 'centralNode');
  const { FQDN, hostingPortRange } = config;

  try {
    const [fedLearn, admin] = await Promise.all([
      reservePort(hostingPortRange),
      reservePort(hostingPortRange),
    ]);

    await provisionRun({
      image_name: imageName,
      userIds,
      path_run,
      computationParameters,
      fed_learn_port: fedLearn.port,
      admin_port: admin.port,
      FQDN,
    });

    await uploadToFileServer({ consortiumId, runId, path_baseDirectory: path_baseDir });
    fedLearn.server.close();
    admin.server.close();

    await launchNode({
      containerService: 'docker',
      imageName,
      directoriesToMount: [{ hostDirectory: path_centralNodeRunKit, containerDirectory: '/workspace/runKit/' }],
      portBindings: [
        { hostPort: fedLearn.port, containerPort: fedLearn.port },
        { hostPort: admin.port, containerPort: admin.port },
      ],
      commandsToRun: ['python', '/workspace/entry_central.py'],
      onContainerExitSuccess: () => reportRunComplete({ runId }),
      onContainerExitError: (_, error) => reportRunError({ runId, errorMessage: error }),
    });

  } catch (error) {
    const errorMessage = `Run ${runId} failed: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMessage);
    await reportRunError({ runId, errorMessage });
  }
}
