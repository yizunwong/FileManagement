import { Router } from 'express'
import {
  uploadFile,
  listAllFiles,
  listFiles,
  listPublicFiles,
  listFilesSharedWithUser,
  deleteFile,
  shareFile,
} from '../controllers/fileController.js'
const router = Router()

router.post('/upload', uploadFile)
router.get('/files/all', listAllFiles)
router.get('/files', listFiles)
router.delete('/files/:id/:userId', deleteFile)
router.post('/files/:id/share', shareFile)
router.get('/files/public', listPublicFiles)
router.get('/files/shared-with-user', listFilesSharedWithUser)

export default router
