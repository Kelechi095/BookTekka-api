import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },

    author: {
      type: String,
    },

    genre: {
      type: String,
    },

    description: {
        type: String
    },

    poster: {
      String
    },

    posterPhoto: {
      type: String,
    },

    thumbnail: {
      type: String,
    },

    smallThumbnail: {
      type: String,
    },

    likes: {
      type: Number,
      default: 0,
    },

    likers: {
      type: [String],
    },
    reviews: [
      {
        review: String,
        reviewer: String,
        reviewerImage: String
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

export default Recommendation;
