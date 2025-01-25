import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js';
import {User} from "../models/user.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// we can access user id using user which will be created in the database
const generateAccessAndRefreshToken = async (userId) => {
   try{
         const user = await User.findById(userId);
         const accessToken = user.generateAccessToken();
         const refreshToken = user.generateAccessAndRefreshToken();
         //now we will save this refreshToken in database where we have refreshToken field
         user.refreshToken = refreshToken;
         // now after sending accessToken we will save this by using save method and as we also need to validate the password so we will use validateBeforeSave: false . So that it do not ask for password validation
         await user.save({validateBeforeSave: false});
          return {accessToken, refreshToken}
   } 
   catch(error){
      throw new ApiError(500, "Something went wrong while generating Refresh tokens");
   }
}
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, email, password, state, language } = req.body;

  // Validation
  if (
    [firstName, lastName, username, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if the user already exists
  const existingUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password: hashedPassword,
    state,
    language,
  });

  // Fetch the created user without sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password, state, language  } = req.body;

  console.log("Login request received");
  console.log("Request body:", { email, username, password,state,language });

  // Validation
  if (!username && !email) {
    console.error("Validation failed: Either username or email is required");
    throw new ApiError(400, "Either username or email is required");
  }

  // Find user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  console.log("User found:", user ? user.username : "No user found");

  if (!user) {
    console.error("User does not exist");
    throw new ApiError(404, "User does not exist");
  }

  // Validate password
  const isPasswordValid = await user.isPasswordCorrect(password);

  console.log("Password validation result:", isPasswordValid);

  if (!isPasswordValid) {
    console.error("Invalid user credentials");
    throw new ApiError(401, "Invalid user credentials");
  }

  // Generate tokens
  // const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  // console.log("Generated tokens:", { accessToken, refreshToken });
 
  // if (!accessToken || !refreshToken) {
  //   console.error("Token generation failed");
  //   throw new ApiError(500, "Failed to generate tokens");
  // }
 const JWT_SECRET = "Token";
  const token = jwt.sign(
    { _id : user._id  },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  // Retrieve user without sensitive fields
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  console.log("Logged in user data (sensitive fields excluded):", loggedInUser);

  // Set cookies
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
  };

  console.log("Setting cookies for tokens");

  return res
    .status(200)
    // .cookie("accessToken", accessToken, options)
    // .cookie("refreshToken", refreshToken, options)
    .cookie("token", token, options)
    .json(
      new ApiResponse(200, { loggedInUser }, "User logged in successfully")
    );
});

const logoutUser = asyncHandler ( async (req,res) => {
   User.findByIdAndUpdate(
      req.user._id,
      {
         $set : {
            refreshToken : undefined
         }
      },
      {
         new : true
      }
   )

   const options = {
      httpOnly : true,
      secure: true
   }
   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, {}, "User logged out successfully"))
})
export {
   registerUser,
   loginUser,
   logoutUser
}