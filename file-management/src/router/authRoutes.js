import { Router } from 'express'
import {
  login,
  logout,
  authenticate,
  register,
  fetchAllUsers,
  fetchUserEmailById,
} from '../controllers/authController.js'
const router = Router()

router.post('/login', login)
router.post('/logout', logout)
router.post('/register', register)
router.get('/authenticate', authenticate)
router.get('/users', fetchAllUsers)
router.get('/users/:userId', fetchUserEmailById)

export default router
