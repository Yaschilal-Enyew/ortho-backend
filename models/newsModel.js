import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    image:{type:String},

},{timestamps:true})

const newsModel = new mongoose.model('news',newsSchema)

export default newsModel;