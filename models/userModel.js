import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    year:{type:Number, required:true},
    department:{type:String, required:true},
    phone:{type:String, required:true, unique:true}
    
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model('User',userSchema);

export default userModel