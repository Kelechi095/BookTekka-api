import express from 'express'
import { createTodo, deleteTodo, getAllTodos, getSingleTodo, updateTodo } from '../controllers/todoController.js'

const router = express.Router()

router.route('/').get(getAllTodos)
router.route('/:id').get(getSingleTodo)
router.route('/').post(createTodo)
router.route('/:id').delete(deleteTodo)
router.route('/:id').patch(updateTodo)

export default router