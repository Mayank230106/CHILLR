import { Router } from "express";
import { 
    loginUser, 
    registerUser, 
    logoutUser, 
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    bookEvent,
    getUserBookings
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.single("avatar"), 
    registerUser
)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT ,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

// Additional routes
router.route("/profile").get(verifyJWT, getCurrentUser)
router.route("/profile/password").put(verifyJWT, changeCurrentPassword)
router.route("/bookings").post(verifyJWT, bookEvent);
router.route("/bookings").get(verifyJWT, getUserBookings);

export default router