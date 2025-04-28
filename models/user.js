import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcryptjs"; 

//Making a new schema in Mongoose to store the user data
const userDetails = new Schema({
    name:{
        type:String ,
        required:true,
        trim:true
    },
    email:{
        type:String ,
        required:true,
        unique:true
    },
    password:{
        type:String ,
        required:true   
    },
   
}, {timestamps:true})

userDetails.pre('save', async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
        next();
})

userDetails.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', userDetails )
export default User

