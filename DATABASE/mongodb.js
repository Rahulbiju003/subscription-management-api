import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';
if(!DB_URI){
throw new Error("Please Define the MONGODB_URI evnviornment variable inside .env.<devlopment/production>.local");
}

const connectToDataBase = async ()=>{
    try{
        await mongoose.connect(DB_URI);
        console.log(`Connected to database in ${NODE_ENV} mode`);
    }catch(error){
        console.log('Error connecting to database',error);
        process.exit(0);
    }
}

export default connectToDataBase;