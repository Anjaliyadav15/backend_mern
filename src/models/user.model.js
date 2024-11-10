import { default as mongoose, Schema } from "mongoose";

const userSchema = new Schema({
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

const User = mongoose.model('User', userSchema);
export default User;