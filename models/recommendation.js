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

    posterId: {
      type: String,
    },

    poster: {
      type: String
    },

    posterPhoto: {
      type: String
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
        review: {
          type: String
        },
        reviewerId: {
          type: String
        },
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

export default Recommendation;
