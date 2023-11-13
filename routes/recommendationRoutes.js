import express from 'express'
import { authenticateUser } from '../middleware/auth.js'
import { addToLibrary, createRecommendation, getRecommendations, likeRecommendation } from '../controllers/recommendController.js'


const router = express.Router()

router.route('/').get(getRecommendations)
router.route('/likes/:id').patch(authenticateUser, likeRecommendation)
router.route('/').post(authenticateUser, createRecommendation)
router.route('/add').post(authenticateUser, addToLibrary)


export default router