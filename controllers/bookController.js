import Book from "../models/bookModel.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import Recommendation from "../models/recommendation.js";

export const getAllBooks = async (req, res, next) => {
  try {
    const { search, status, sort } = req.query;

    const queryObject = {posterId: req.user._id.toString()};

    
    if (search) {
      queryObject.title = { $regex: search, $options: "i" };
    }

    if (status && status !== "All") {
      queryObject.status = status;
    }

    const sortOptions = {
      Newest: "-createdAt",
      Oldest: "createdAt",
      "A-Z": "title",
      "Z-A": "-title",
    };

    const sortKey = sortOptions[sort] || sortOptions.Latest;

    // setup pagination

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find(queryObject)
      .sort(sortKey)
      .skip(skip)
      .limit(limit);
    const totalBooks = await Book.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalBooks / limit);
    res
      .status(200)
      .json({totalBooks, numOfPages, books })
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
    const {
      title,
      author,
      status,
      genre,
      description,
      thumbnail,
      smallThumbnail,
    } = req.body;

    if (
      !title ||
      !author ||
      !status ||
      !genre ||
      !thumbnail ||
      !smallThumbnail
    )
      return next(errorHandler(400, "Value required"));

      const isExists = await Book.findOne({id: req.user._id.toString(), title})

      if(isExists) return res.status(400).json({msg: "Book already exists in your library"})

    const user = await User.findOne({ email: req.user.email });

    const newBook = new Book({
      title,
      author,
      status,
      genre,
      description,
      thumbnail,
      smallThumbnail,
      posterId: user._id
    });

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
    const { status, genre} = req.body;
    if (!status || !genre) return next(errorHandler(400, "Value required"));
    const book = await Book.findOne({ _id: id });
    if (!book) return next(errorHandler(400, "No Book found"));

    book.status = status;
    book.genre = genre;

    await book.save();
    res.status(200).json({ msg: "Book updated" });
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};
export const updateProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const { currentPage, totalPages } = req.body;

    if (!currentPage || !totalPages)
      return next(errorHandler(400, "Value required"));

    const newProgress = Math.round(
      (Number(currentPage) / Number(totalPages)) * 100
    );

    const book = await Book.findOne({ _id: id });
    if (!book) return next(errorHandler(400, "No Book found"));

    book.progress = newProgress;

    await book.save();
    res.status(200).json({ msg: "Book progress updated" });
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};

export const getOverview = async(req, res) => {
  try {

    const totalBooks = await Book.countDocuments({posterId: req.user._id.toString()})
    const totalUnread = await Book.countDocuments({posterId: req.user._id.toString(), status: "Unread"})
    const totalReading = await Book.countDocuments({posterId: req.user._id.toString(), status: "Reading"})
    const totalFinished = await Book.countDocuments({posterId: req.user._id.toString(), status: "Finished"})
    const totalRecommendations = await Recommendation.countDocuments({posterId: req.user._id.toString()})


    res.status(200).json({totalBooks, totalUnread, totalReading, totalFinished, totalRecommendations})
  } catch (error) {
    next(errorHandler(400, error.message));
  }
}
