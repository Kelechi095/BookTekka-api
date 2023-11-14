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
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
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
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: [true, "Please provide user"],
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
