import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            default : "",
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            default: ""
        },
        coverImage: {
            type: String, // cloudinary url
            default : ""
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) { //pre is a hook that runs before the save method or save data
    if(!this.isModified("password")) return next(); // next() method is called to call the method
     
    this.password = await bcrypt.hash(this.password, 10) // to hash the code which was encrypted
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password) //we compare the password user has send and also the bcrypt password

}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign( // sign is a method under jwt which is used to generate token. it has payload , secret key and expiry time.
        {
            _id: this._id, //this we can get from mongoDB
            email: this.email,
            username: this.username,
            fullName: this.fullName //fullname is coming from payload and this.fullname is coming from database

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
//as the refresh token used to refresh again and again so we keep little  data i.e. only id inside it

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign( 
        {
            _id: this._id, 
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)