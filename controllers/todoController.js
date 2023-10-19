import Todo from "../models/todoModel.js";
import { errorHandler } from "../utils/error.js";

export const getAllTodos = async (req, res, next) => {
  const todos = await Todo.find();
  res.status(200).json({todos});
  try {
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};
export const getSingleTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id });
    if (!todo) return next(errorHandler(400, "No todo found"));

    res.status(200).json({todo});
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};

export const createTodo = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title) return next(errorHandler(400, "Value required"));
    const newTodo = new Todo({ title });

    await newTodo.save();
    res.status(201).json({ msg: "Todo created successfully" });
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};

export const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id });
    if (!todo) return next(errorHandler(400, "No todo found"));

    await Todo.findOneAndDelete({ _id: id });
    res.status(200).json({ msg: "Todo deleted successfully" });
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};

export const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    if (!title) return next(errorHandler(400, "Value required"));
    const todo = await Todo.findOne({ _id: id });
    if (!todo) return next(errorHandler(400, "No todo found"));

    todo.title = title;
    await todo.save();
    res.status(200).json({msg: 'Todo updated'})
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};
