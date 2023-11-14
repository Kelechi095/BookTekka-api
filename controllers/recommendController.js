import Recommendation from "../models/recommendation.js";
import { errorHandler } from "../utils/error.js";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";

export const getRecommendations = async (req, res, next) => {
  try {
    const { search, genre, sort } = req.query;

    const queryObject = {};

    if (search) {
      queryObject.title = { $regex: search, $options: "i" };
    }

    if (genre && genre !== "All") {
      queryObject.genre = genre;
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

    /* async function getUsername(posterId) {
      const user = await User.findOne({ _id: posterId });
      return user.username;
    }
    async function getPhoto(posterId) {
      const user = await User.findOne({ _id: posterId });
      return user.profilePicture;
    } */

   
    const promises = recommendations.map(async(rec) => {
      const user = await User.findOne({_id: rec.posterId})
      
      return {
        ...rec,
        poster: user.username,
        posterPhoto: user.profilePicture,
      };
    });

    
    const actualRecommendation = await Promise.all(promises)

    //console.log(actualRecommendation)

    const numOfPages = Math.ceil(totalRecommendations / limit);
    res
      .status(200)
      .json({
        totalRecommendations,
        numOfPages,
        recommendations: [{...actualRecommendation[0]._doc, poster: actualRecommendation[0].poster, posterPhoto: actualRecommendation[0].posterPhoto}],
      });
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};

export const likeRecommendation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const recommendation = await Recommendation.findOne({ _id: id });

    if (recommendation.likers.includes(req.user.username)) {
      await Recommendation.findOneAndUpdate(
        { _id: id },
        { $pull: { likers: req.user.username }, $inc: { likes: -1 } }
      );

      res.status(200).json({ msg: "UnLike successful" });
    } else {
      await Recommendation.findOneAndUpdate(
        { _id: id },
        { $push: { likers: req.user.username }, $inc: { likes: 1 } }
      );
      res.status(200).json({ msg: "Like successful" });
    }
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};

export const addToLibrary = async (req, res, next) => {
  const { title, author, genre, description, thumbnail, smallThumbnail } =
    req.body;
  try {
    const newBook = new Book({
      title,
      author,
      genre,
      status: "Unread",
      description,
      thumbnail,
      smallThumbnail,
      posterId: req.user._id,
    });

    await newBook.save();
    res.status(201).json({ msg: "Book added to library" });
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};
export const createRecommendation = async (req, res, next) => {
  const { title, author, genre, description, thumbnail, smallThumbnail } =
    req.body;
  try {
    const isExists = await Recommendation.findOne({ title });

    if (isExists) return res.status(400).json({ msg: "Book already exists" });

    const newRecommendation = new Recommendation({
      title,
      author,
      genre,
      description,
      thumbnail,
      smallThumbnail,
      posterId: req.user._id,
    });

    await newRecommendation.save();
    res.status(201).json({ msg: "Book added to recommendation" });
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { bookId, review, reviewer } = req.body;

    if (!review) return res.status(400).json({ msg: "Review required" });

    await Recommendation.findOneAndUpdate(
      { _id: bookId },
      { $push: { reviews: { review, reviewer, reviewerId: req.user._id } } }
    );

    res.status(200).json({ msg: "Review added successfully" });
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};

export const getSingleRecommendation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recommendation = await Recommendation.findOne({ _id: id });
    if (!recommendation) return next(errorHandler(400, "No book found"));

    res.status(200).json(recommendation);
  } catch (error) {
    next(errorHandler(400, error.message));
  }
};
