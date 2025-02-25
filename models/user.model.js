import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'user name is required'],
        trim: true,
        minLength:2,
        maxLength:50,
    },
    email:{
        type: String,
        required: [true,'user email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        minLength:5,
        maxLength:255,
        match: [/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/,'please enter a valid email']
    },
    password:{
        type: String,
        required: [true,'user password is required'],
        minLength:6,
    },
},{timestamps:true});

const User = mongoose.model('User',userSchema);

export default User;