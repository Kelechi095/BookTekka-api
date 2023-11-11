import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  
title: {
    type: String,
    default: "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg",
  },
  poster: {
    type: String,
  },
  posterId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user"],
  },
}, {
    timestamps: true
});

const Photo = mongoose.model('Photo', photoSchema)

export default Photo