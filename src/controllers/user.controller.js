import {asyncHandler} from "../utilis/asyncHandler.js";
import {ApiError, apiError} from '../utilis/ApiError.js';
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utilis/cloudinary.js";
import {ApiResponse} from "../utilis/ApiResponse.js";
const registerUser = asyncHandler ( async (req,res) => {
   const {fullname, email, username, password} = req.body
   console.log("email :" , email);
   //validation
   if(
      [fullname, email, username, password].some((field) =>
         field.trim() === "" )
   ){
      throw new ApiError(400, "All fields are required");
   }
   //findone will find the user with email or username
  const existedUser =  User.findOne({
      $or: [{ username }, { email }]
   })
   if(existedUser) {
   throw new ApiError( 409 , "user with email or username already exists")
   }
   //multer gives us access of files
   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if(!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
   }
   //uploading on Cloudinary
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);
   //we will check if the avatar is uploaded or not
   if(!avatar)
   {
      throw new ApiError(400, "Avatar file is required");
   }
   const user = await User.create({
      fullname,
      avatar : avatar.url,
      coverImage : coverImage?.url || "" ,
      email,
      password,
      username : username.toLowerCase()
   })
   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken" // we have to write the fields which we do not want inside the string with negative sign and here we do not require password and refreshToken
   ) //database asign _.id to every user when their account is created so if the _.id is found then we can confirm that user is created but if it is not found then user is not created
   if(!createdUser) {
      throw new ApiError(500 , "Something went wrong while registering the user");
   }

   return res.status(201).json(
      new ApiResponse(200, createdUser, "User registered Successfully");
   )
})
export {
   registerUser,
} 