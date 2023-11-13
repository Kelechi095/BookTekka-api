import Recommendation from "../models/recommendation.js";
import { errorHandler } from "../utils/error.js";
import Book from "../models/bookModel.js";

export const getRecommendations = async (req, res, next) => {
  try {
    const { search, status, sort } = req.query;

    const queryObject = {};

    if (search) {
      queryObject.title = { $regex: search, $options: "i" };
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

    const recommendations = await Recommendation.find(queryObject)
      .sort(sortKey)
      .skip(skip)
      .limit(limit);
    const totalRecommendations = await Recommendation.countDocuments(
      queryObject
    );
    const numOfPages = Math.ceil(totalRecommendations / limit);
    res.status(200).json({ totalRecommendations, numOfPages, recommendations });
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};

export const likeRecommendation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const recommendation = await Recommendation.findOne({ _id: id });

    if (recommendation.likers.includes(req.user.username)) {
      recommendation.likes = recommendation.likes - 1;
      const newLikers = recommendation.likers.filter(
        (user) => user !== req.user.username
      );
      recommendation.likers = newLikers;
      await recommendation.save();
      res.status(200).json({ msg: "Recommendation unliked" });
    } else {
      recommendation.likes = recommendation.likes + 1;
      const newLikers = recommendation.push(req.user.username);
      recommendation.likers = newLikers;
      await recommendation.save();
      res.status(200).json({ msg: "Recommendation liked" });
    }
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};
export const addToLibrary = async (req, res, next) => {
  const { id } = req.params;
  try {
    const recommendation = await Recommendation.findOne({ _id: id });

    const newBook = new Book({
      title: recommendation.title,
      author: recommendation.author,
      genre: recommendation.genre,
      description: recommendation.description,
      thumbnail: recommendation.thumbnail,
      smallThumbnail: recommendation.smallThumbnail,
      posterId: req.user._id,
    });

    await newBook.save();
    res.status(201).json({ msg: "Book added to library" });
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};
export const createRecommendation = async (req, res, next) => {
  const { id } = req.params;
  try {
    const book = await Book.findOne({ _id: id });

    const newRecommendation = new Recommendation({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      thumbnail: book.thumbnail,
      smallThumbnail: book.smallThumbnail,
      posterId: req.user._id,
      posterPhoto: req.user.profilePicture
    });

    await newRecommendation.save();
    res.status(201).json({ msg: "Book added to recommendation" });
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};
