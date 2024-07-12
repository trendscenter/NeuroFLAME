import express from 'express';
import downloadRoute from './routes/downloadRoute.js';
import uploadRoute from './routes/uploadRoute.js';
import getConfig from './config/getConfig.js';

const init = async () => {
  const app = express();
  const config = await getConfig();
  const { port: PORT } = config;

  app.use(express.json());

  app.use('/api', downloadRoute);
  app.use('/api', uploadRoute);

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

init().catch((error: any) => {
  console.error('Failed to initialize server:', error);
  process.exit(1);
});
