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
    const { title, author, status, genre, price } = req.body;

    if (!title || !author || !status || !genre || !price)
      return next(errorHandler(400, "Value required"));

    const newBook = new Book({ title, author, status, genre, price });

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
    const { title, author, status, genre, price, progress } = req.body;
    if (!title || !author || !status || !genre || !price)
      return next(errorHandler(400, "Value required"));
    const book = await Book.findOne({ _id: id });
    if (!book) return next(errorHandler(400, "No Book found"));

    book.title = title;
    book.author = author;
    book.status = status;
    book.genre = genre;
    book.price = price;
    book.progress = progress;
    await book.save();
    res.status(200).json({ msg: "Book updated" });
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};
export const updateProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPage, totalPages } = req.body;

    console.log(currentPage)

    if (!currentPage || !totalPages) return next(errorHandler(400, "Value required"));

    const newProgress = Math.round((Number(currentPage)/Number(totalPages)) * 100)

    const book = await Book.findOne({ _id: id });
    if (!book) return next(errorHandler(400, "No Book found"));

    book.progress = newProgress;

    await book.save();
    res.status(200).json({ msg: "Book progress updated" });
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};
