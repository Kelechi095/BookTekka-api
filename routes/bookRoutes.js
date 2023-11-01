import express from 'express'
import { createBook, deleteBook, getAllBooks, getSingleBook, updateBook, updateProgress } from '../controllers/bookController.js'

const router = express.Router()

router.route('/').get(getAllBooks)
router.route('/:id').get(getSingleBook)
router.route('/').post(createBook)
router.route('/:id').delete(deleteBook)
router.route('/:id').patch(updateBook)
router.route('/progress/:id').patch(updateProgress)

export default router