import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import unzipper from 'unzipper';
import getConfig from './config/getConfig.js';

interface TokenPayload {
  consortiumId?: string;
  runId?: string;
  userId: string;
  roles?: string[];
}

declare global {
  namespace Express {
    interface Request {
      tokenPayload?: TokenPayload;
    }
  }
}

const init = async () => {
  const app = express();
  const config = await getConfig();
  const PORT = config.port;
  const BASE_DIR = config.baseDir;
  const AUTHENTICATION_URL = config.authenticationUrl;

  const decodeAndValidateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.headers['x-access-token'] as string | undefined;
    if (!token) {
      res.status(401).send('Access token is required');
      return;
    }

    try {
      const response = await axios.post(AUTHENTICATION_URL, { token });

      // Check if the auth server confirms the token validity
      if (
        response.status === 200 &&
        response.data &&
        response.data.decodedAccessToken
      ) {
        req.tokenPayload = response.data.decodedAccessToken; // Assuming this is a valid user object
        next();
      } else {
        res.status(401).send('Invalid token');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).send('Authentication service error');
    }
  };

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const { consortiumId, runId } = req.params;
      const uploadPath = path.join(BASE_DIR, consortiumId, runId); // Temporarily store ZIP here
      fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Keep the original filename
    },
  });

  const upload = multer({ storage: storage });

  // Middleware to ensure that only users with id 'central' can upload files
  const isCentralUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.tokenPayload && req.tokenPayload.roles?.includes('central')) {
      next();
    } else {
      res.status(403).send('Unauthorized: Only central user can upload files.');
    }
  };

  async function fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  app.use(express.json());

  app.post(
    '/download/:consortiumId/:runId/:userId',
    decodeAndValidateJWT,
    async (req: Request, res: Response): Promise<void> => {
      const tokenPayload = req.tokenPayload!;
      // ensure that the tokenPayload has the required fields and that the data in the fields matches the URL parameters

      if (
        !tokenPayload ||
        !tokenPayload.consortiumId ||
        !tokenPayload.runId ||
        !tokenPayload.userId
      ) {
        res.status(400).send('Missing required tokenPayload payload data');
        return;
      }
      if (
        tokenPayload.consortiumId !== req.params.consortiumId ||
        tokenPayload.runId !== req.params.runId ||
        tokenPayload.userId !== req.params.userId
      ) {
        res
          .status(400)
          .send('tokenPayload payload data does not match requested resource');
        return;
      }

      const filePath = path.join(
        BASE_DIR,
        tokenPayload.consortiumId,
        tokenPayload.runId,
        `${tokenPayload.userId}.zip`
      );

      if (await fileExists(filePath)) {
        res.sendFile(filePath);
      } else {
        res.status(404).send('File not found');
      }
    }
  );

  app.post(
    '/upload/:consortiumId/:runId',
    decodeAndValidateJWT,
    isCentralUser,
    upload.single('file'),
    async (req: Request, res: Response) => {
      if (req.file) {
        try {
          // Define the path where the ZIP file is temporarily stored
          const zipPath = req.file.path;
          // Define the destination path for extracted contents
          const extractPath = path.join(
            BASE_DIR,
            req.params.consortiumId,
            req.params.runId
          );

          // Unzip the file to the destination directory
          const zipStream = fs.createReadStream(zipPath).pipe(
            unzipper.Extract({ path: extractPath })
          );

          // Listen for errors in the unzipping process
          zipStream.on('error', (error: any) => {
            console.error('Error unzipping file:', error);
            res.status(500).send(`Error unzipping the file: ${error.message}`);
          });

          // Wait for the stream to finish
          await zipStream.promise();

          // Optionally, delete the ZIP file after extraction
          fs.unlinkSync(zipPath);

          res.send(`File uploaded and extracted successfully to ${extractPath}`);
        } catch (error: any) {
          console.error('Error unzipping file:', error);
          res.status(500).send(`Error unzipping the file: ${error.message}`);
        }
      } else {
        res.status(400).send('No file uploaded.');
      }
    }
  );

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

init().catch((error) => {
  console.error('Failed to initialize server:', error);
  process.exit(1);
});
