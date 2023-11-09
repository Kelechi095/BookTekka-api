import express from 'express'
import { getOverview } from '../controllers/bookController.js'

const router = express.Router()

router.route('/').get(getOverview)

export default router