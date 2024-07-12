import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import unzipper from 'unzipper';
import decodeAndValidateJWT from '../middleware/decodeAndValidateJWT.js';
import isCentralUser from '../middleware/isCentralUser.js';
import calculateChecksum from '../utils/calculateChecksum.js';
import getConfig from '../config/getConfig.js';

const router = Router();

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { consortiumId, runId } = req.params;
    const config = await getConfig();
    const { baseDir: BASE_DIR } = config;
    const uploadPath = path.join(BASE_DIR, consortiumId, runId);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, file.originalname),
});

const upload = multer({ storage });

router.post('/upload/:consortiumId/:runId', decodeAndValidateJWT, isCentralUser, upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  const { path: zipPath, originalname } = req.file;
  const extractPath = path.join(res.locals.BASE_DIR, req.params.consortiumId, req.params.runId);

  try {
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(zipPath)
        .pipe(unzipper.Parse())
        .on('entry', (entry) => entry.autodrain())
        .on('error', (error) => reject(error))
        .on('close', () => resolve());
    });

    const checksumAfterValidation = await calculateChecksum(zipPath);
    console.log(`Checksum after validation: ${checksumAfterValidation}`);

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: extractPath }))
        .on('close', () => resolve())
        .on('error', (error) => reject(error));
    });

    const checksumAfterExtraction = await calculateChecksum(zipPath);
    console.log(`Checksum after extraction: ${checksumAfterExtraction}`);

    res.send(`File ${originalname} uploaded and extracted successfully to ${extractPath}`);
  } catch (error: any) {
    console.error('Error during file upload and extraction:', error);
    res.status(500).send(`Error during file upload and extraction: ${error.message}`);
  }
});

export default router;
