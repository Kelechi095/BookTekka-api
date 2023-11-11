import express from "express";
import { createPhoto, getPhoto } from "../controllers/userController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

router.route("/get-photo").get(authenticateUser, getPhoto);
router.route("/create-photo").post(authenticateUser, createPhoto);

export default router;