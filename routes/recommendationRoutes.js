import express from 'express'
import { authenticateUser } from '../middleware/auth.js'
import { addToLibrary, createRecommendation, getRecommendations, likeRecommendation } from '../controllers/recommendController.js'


const router = express.Router()

router.route('/').get(getRecommendations)
router.route('/:id').patch(authenticateUser, likeRecommendation)
router.route('/:id').post(authenticateUser, createRecommendation)
router.route('/add/:id').post(authenticateUser, addToLibrary)


export default router