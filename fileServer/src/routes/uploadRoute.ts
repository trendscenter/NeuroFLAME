import { Router, Request, Response, NextFunction } from 'express'
import decodeAndValidateJWT from '../middleware/decodeAndValidateJWT.js'
import isCentralUser from '../middleware/isCentralUser.js'
import { uploadFile } from '../middleware/uploadFile.js'
import { unzipFile } from '../middleware/unzipFile.js'
import testUnzip from '../middleware/testUnzip.js'

const router = Router()

interface MulterRequest extends Request {
  file: Express.Multer.File
  unzippedPath?: string
}

router.post(
  '/upload/:consortiumId/:runId',
  decodeAndValidateJWT,
  isCentralUser,
  // uploadFile,
  // unzipFile,
  (req: Request, res: Response, next: NextFunction) =>
    testUnzip(req as MulterRequest, res, next),
  (req: Request, res: Response) => {
    res.send(`File uploaded and extracted successfully!`)
  },
)

export default router
