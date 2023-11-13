import express from 'express'
import { createBook, deleteBook, getAllBooks, getSingleBook, updateBook, updateProgress } from '../controllers/bookController.js'
import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

router.route('/').get(authenticateUser, getAllBooks)
router.route('/:id').get(getSingleBook)
router.route('/').post(createBook, authenticateUser)
router.route('/:id').delete(deleteBook, authenticateUser)
router.route('/:id').patch(updateBook, authenticateUser)
router.route('/progress/:id').patch(updateProgress)

export default router