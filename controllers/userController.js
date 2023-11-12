import { v2 as cloudinary } from 'cloudinary'

import Photo from "../models/photoModel.js";

export const getPhoto = async (req, res) => {
  try {
    const photo = await Photo.findOne({ posterId: req.user._id });

    /* if (!photo)
      return res.status(200).json({
        poster: "blank",
        title:
          "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg",
      });

    res.status(200).json({ title: photo.title, poster: photo.poster });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}; */

export const createPhoto = async (req, res) => {
  try {
    const { file } = req.body;
    if (!file) return res.status(400).json("file required");

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })


    const uploadRes = await cloudinary.uploader.upload(file, {
      upload_preset: "mernAuth",
    });

    if (uploadRes) {
      const newPhoto = new Photo({
        title: uploadRes.url,
        poster: req.user.username,
        posterId: req.user._id,
      });

      await Photo.deleteMany({ posterId: req.user._id });
      await newPhoto.save();
      res.status(200).json({ title: newPhoto.title, poster: newPhoto.poster });
    }
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};