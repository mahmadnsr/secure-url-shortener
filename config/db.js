import mongoose from "mongoose";


async function connectMongoDB(url){

    try{
        await mongoose.connect(url);
        console.log(`mongoDB connected...`);
            
    }
    catch(err){
        console.log("failed to connect DB.");
        console.error(err.message)
        process.exit(1);
    }
}

export {connectMongoDB};