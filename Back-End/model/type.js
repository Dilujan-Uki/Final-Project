import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unquie:true
    },
    password:{
        type:String,
        required:true,
        unque:true
    },


},{timestamps:true});

export default mongoose.model("user",userSchema);
