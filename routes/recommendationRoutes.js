import express from 'express'
import { authenticateUser } from '../middleware/auth.js'
import { addReview, addToLibrary, createRecommendation, getRecommendations, getSingleRecommendation, likeRecommendation } from '../controllers/recommendController.js'


const router = express.Router()

router.route('/').get(getRecommendations)
router.route('/likes/:id').patch(authenticateUser, likeRecommendation)
router.route('/').post(authenticateUser, createRecommendation)
router.route('/add').post(authenticateUser, addToLibrary)
router.route('/review').post(authenticateUser, addReview)
router.route('/:id').get(authenticateUser, getSingleRecommendation)


export default router