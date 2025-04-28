import mongoose from "mongoose";

const connectDB = async () => {
    try{
        //connecting to mongoose
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected : ${conn.connection.host}`)
    }
    catch(error){
        //if there is any error, display that error
        console.log(`Error: ${error.message}`)
        process.exit(1);
    }
}

export default connectDB