import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const DBurl = process.env.DB_URL;
async function dbConnect(){
    try{
        await mongoose.connect(`${DBurl}/Quickify`);
        console.log("DB Connected Successfully");
    }
    catch(err){
        console.log(`Error Connecting to db ${err}`);
    }
}
export default dbConnect;