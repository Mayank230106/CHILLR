import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateRefreshAndAccessTokens = async(userID) =>
{
    try{
        const user = await User.findById(userID)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    }
    catch(error)
    {
        throw new ApiError(500,"something went wrong while generating access and refresh token")
    }
}

//trying to register user here

    //how about, first we get the inputs somehow from frontend
    //with axios get that data in backend, maybe??
    // validation lagega
    // check if user already exist
    // if no, then add to database
    // upload to cloudinary(images and stuff)
    // create user object
    // create entry in db
    // remove password and refresh token from response
    // check for user creation
    // return res

const registerUser = asyncHandler( async(req,res) => {
    

    //console.log("register user called")

    //console.log(req.body)

    const {fullname, email, username, password} = req.body

    //console.log(`email: ${email}`)

    if(
        [fullname,email,username,password].some((field) =>
        field?.trim() === "")
    ) {
        throw new ApiError(400,"fullname is required");
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser)
    {
        throw new ApiError(409, "user with username or email already exists")
    }

    console.log("req.file:", req.file); 

    const avatarLocalPath = req.file?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;


    if(!avatarLocalPath)
    {
        throw new ApiError(400,"avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar)
    {
        throw new ApiError(400,"avatar is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        email,
        password,
        username
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser)
    {
        throw new ApiError(500,"something went wrong while creating user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )
})

const loginUser = asyncHandler( async(req,res) => {
    //get data from req body
    //check if user not registered already(username or email)
    //find the user in database
    //check password
    //access token or refresh token
    //send these tokens in cookie

    const {username, email, password} = req.body
    
    if(!(username || email))
    {
        throw new ApiError(400,"username or password required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user)
    {
        throw new ApiError(400,"user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid)
    {
        throw new ApiError(401,"invalid password detected")
    }

    const {accessToken, refreshToken} = await generateRefreshAndAccessTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    console.log("user logged in successfully")

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in Successfully"
        )
    )
})

const logoutUser = asyncHandler( async(req,res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler( async(req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken)
    {
        throw new ApiError(401,"unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user)
        {
            throw new ApiError(401,"invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken)
        {
            throw new ApiError(401,"refresh token is invalid or unused")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateRefreshAndAccessTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken : newRefreshToken}
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token")
    }
})

const changeCurrentPassword = asyncHandler( async(req,res) => {
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect)
    {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler( async(req,res) => {
    return res
    .status(200)
    .json(200,req.user, "current user fetched successfully")
})

const bookEvent = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { eventId, ticketsCount } = req.body;

    // Validate ticketsCount is a positive integer
    if (
        !eventId ||
        typeof ticketsCount !== "number" ||
        !Number.isInteger(ticketsCount) ||
        ticketsCount < 1
    ) {
        throw new ApiError(400, "Event ID and valid ticket count required");
    }

    const user = await User.findById(userId);

    // Check if already booked and update count if so
    const booking = user.bookings.find(b => b.eventId.toString() === eventId);
    if (booking) {
        booking.ticketsCount += ticketsCount;
        booking.bookingDate = new Date(); // Optionally update booking date
    } else {
        user.bookings.push({
            eventId,
            ticketsCount,
            bookingDate: new Date(),
            status: "confirmed"
        });
    }
    await user.save();

    return res.status(200).json(new ApiResponse(200, user.bookings, "Event booked successfully"));
});

const getUserBookings = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate("bookings.eventId")
        .select("bookings");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, user.bookings, "User bookings fetched"));
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    bookEvent,
    getUserBookings
}