import express from 'express'
import {getProfile, loginUser, loginWithGoogle, logoutUser, refresh, registerUser, setUser, updateUsername} from '../controllers/authController.js'
//import { verifyJWT } from '../middleware/auth.js'
import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route('/user').get(setUser)
router.route('/google').post(loginWithGoogle)
router.route('/logout').get(logoutUser)
router.route("/profile").get(authenticateUser, getProfile)
router.route("/refresh").get(refresh)
router.route("/update").patch(authenticateUser, updateUsername)

export default router