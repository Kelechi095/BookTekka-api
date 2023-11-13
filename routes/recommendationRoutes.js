import express from 'express'
import { authenticateUser } from '../middleware/auth.js'
import { addToLibrary, createRecommendation, getRecommendations, likeRecommendation } from '../controllers/RecommendationController.js'

const router = express.Router()

router.route('/').get(getRecommendations)
router.route('/:id').patch(authenticateUser, likeRecommendation)
router.route('/:id').post(authenticateUser, createRecommendation)
router.route('/:id').post(authenticateUser, addToLibrary)
//router.route("/recommend").post(Recommendation)


export default router