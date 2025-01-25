import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim : true
  },
  lastName: {
      type: String,
     
      trim : true
  },
  username: {
      type: String,
      
      trim : true,
      unique : true
  },
  email: {
      type: String,
      trim : true,
      unique : true
  },
  state: {
      type: String,
      trim : true
  },
  language: {
      type: String,  
      trim : true
  },
  password: {
      type: String,
      require : true
      
  }
},{timestamps : true});

userSchema.methods.isPasswordCorrect = async function (password) {
    // Use bcrypt.compare to check if the hashed password matches
    return await bcrypt.compare(password, this.password); // Compare with the hashed password stored in the DB
  };
// Method to generate an access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
      state : this.state,
      language : this.language
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Method to generate a refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
