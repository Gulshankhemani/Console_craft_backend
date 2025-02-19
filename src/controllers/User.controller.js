import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.model.js";
import {uploadOncloudinary} from "../utils/cloudyinary.js";
import { ApiResponse } from "../utils/ApiRsponse.js";
import { log } from "console";

const registerUser = asyncHandler(async (req, res) => {
   // get user details from frontend
   // validation - not empty 
   //check if user already exist : username , email
   // check for images ,scheck for avatar
   //upload them to cloudinary, avtar
   // create user object- create entry in db
   // remove password and refresh token field from response
   // check for user creation 
   // return res 
   
   
   const {Username, email, Fullname, password} = req.body
   console.log("email:",email);

   if([Fullname, email, Username, password].some((field)=>field?.trim()==="")){
    throw new ApiError(400, "All fields are required")
   }if (!email.includes("@")) {
      throw new ApiError(400, "Invalid email address");
  }
   const existedUser= await User.findOne({
      $or:[{Username},{email}]
   })
   if(existedUser){
      throw new ApiError(409 , "User already exists")
   }

   console.log("req.files:",req.files);
   
   const avatarLocalPath = req.files?.avatar?.[0]?.path;
   let coverImageLocalPath;
   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
       coverImageLocalPath = req.files.coverImage[0].path
   }
   

   const avatar = await uploadOncloudinary(avatarLocalPath)
   const coverImage = await uploadOncloudinary(coverImageLocalPath)

   

   if(!avatar){
      throw new ApiError(400, "Avatar file is required")
   }
   if(!coverImage){
      throw new ApiError(400, "Cover Image file is required")
   }

   const user = await User.create({
      Fullname,
      avatar: avatar.url, 
      coverImage: coverImage?.url || "", // to ceheck if cover image is there or not so that code work
      email,
      password, 
      Username: Username.toLowerCase(),
   })
   const createdUser =await User.findById(user._id).select(
      "-password -refreshToken"
   )

   if(!createdUser){
      throw new ApiError(500, "something went worng regestring the user")
   }

   return res.status(201).json(new ApiResponse(200,createdUser,"User registered succesfully"))

});

export {registerUser}