import express from 'express'
import { getOverview } from '../controllers/bookController.js'
import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

router.route('/').get(authenticateUser, getOverview)

export default router