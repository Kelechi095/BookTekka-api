import Book from "../models/bookModel.js";
import { errorHandler } from "../utils/error.js";

export const getAllBooks = async (req, res, next) => {
  const books = await Book.find();
  res.status(200).json(books);
  try {
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};
export const getSingleBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findOne({ _id: id });
    if (!book) return next(errorHandler(400, "No book found"));

    res.status(200).json(book);
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};

export const createBook = async (req, res, next) => {
  try {
    const { title, author, read, price } = req.body;

    if (!title || !author || !read || !price)
      return next(errorHandler(400, "Value required"));
    const newBook = new Book({ title, author, read, price});

    await newBook.save();
    res.status(201).json({ msg: "Book created successfully" });
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findOne({ _id: id });
    if (!book) return next(errorHandler(400, "No book found"));

    await Book.findOneAndDelete({ _id: id });
    res.status(200).json({ msg: "Book deleted successfully" });
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};

export const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, read, price } = req.body;
    if (!title |!author ||!read || !price) return next(errorHandler(400, "Value required"));
    const book = await Book.findOne({ _id: id });
    if (!todo) return next(errorHandler(400, "No Book found"));

    book.title = title;
    book.author = author
    book.read = read;
    book.price = price;
    await book.save();
    res.status(200).json({ msg: "Book updated" });
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};
