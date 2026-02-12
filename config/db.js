import mongoose, { mongo } from "mongoose";

 const connectDB = async () => {
    try {
        mongoose.connection.on('connected', ()=>{
             console.log("Mongodb is connected!")
        })
        await mongoose.connect(`${process.env.MONGO_URI}`)
        
    } catch (error) {
        console.log(error.message)
    }
}

export default connectDB;