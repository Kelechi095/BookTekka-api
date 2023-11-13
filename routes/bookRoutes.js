import express from 'express'
import { createBook, deleteBook, getAllBooks, getSingleBook, updateBook, updateProgress } from '../controllers/bookController.js'
import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

router.route('/').get(authenticateUser, getAllBooks)
router.route('/:id').get(authenticateUser, getSingleBook)
router.route('/').post(authenticateUser, createBook)
router.route('/:id').delete(authenticateUser, deleteBook)
router.route('/:id').patch(authenticateUser, updateBook)
router.route('/progress/:id').patch(authenticateUser, updateProgress)

export default router