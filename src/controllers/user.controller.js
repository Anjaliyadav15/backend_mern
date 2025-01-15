import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js';
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
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
   const { fullname, email, username, password } = req.body;
 
   // Validation
   if (
     [fullname, email, username, password].some(
       (field) => !field || field.trim() === ""
     )
   ) {
     throw new ApiError(400, "All fields are required");
   }
 
   // Check if the user already exists
   const existedUser = await User.findOne({
     $or: [{ username }, { email }],
   });
   if (existedUser) {
     throw new ApiError(409, "User with email or username already exists");
   }
 
   // Create user (without avatar and coverImage)
   const user = await User.create({
     fullname,
     email,
     password,
     username: username.toLowerCase(),
   });
 
   // Fetch the created user without password and refreshToken
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
 
const loginUser = asyncHandler(async (req,res) => {
    //req body -> data
    // username or email
    //find user
    //password check 
    //if password is correct then  generate access and refresh token
    //send the tokens in form of cookies
    const {email, username, password} = req.body;
    console.log(email);
    if (!username && !email)
    {
      throw new ApiError(400, "username or email is required");

    }
   const user = await User.findOne({ 
      $or: [{username}, {email}]
   })
   if (!user)
   {
      throw new ApiError(404, "User does not exists");
   }
  const isPasswordValid=  await user.isPasswordCorrect(password); //here user is the const which contain the values
  if (!isPasswordValid)
   {
      throw new ApiError(404, "Invalid user credentials");
   }
   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id); //we have now directly called the accessToken function which we have created above and passed id
   // here we have selected the fields which we do not want to show
   const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
   ) 
   console.log(loggedInUser); 
   //now we will send the token in the form of cookies
   const options = {
      httpOnly : true,
      secure : true

   }
   return res 
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
      new ApiResponse(
      200,
      {
       loggedInUser, accessToken,
       refreshToken
      },
   
      "User logged in successfully")
   )
    
})

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