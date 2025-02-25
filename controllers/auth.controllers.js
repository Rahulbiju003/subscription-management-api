import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { JWT_EXPIRE } from '../config/env.js';
import User from '../models/user.model.js';

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email:email});
        // Check if the user already exists
        if (existingUser){
            const error = Error("User already exists");
            error.statusCode = 409;
            throw error;
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        // Create the user
        const newUser = await User.create([{name:name,email:email,password:hashedPassword}],{session:session});
        // Generate a token
        const token = await jwt.sign({userId:newUser[0]._id},JWT_SECRET,{expiresIn:JWT_EXPIRE});
        // Commit the transaction
        await session.commitTransaction();

        session.endSession();

        res.status(201).json({
            success:true,
            message:"User created successfully",
            data:{
                token,
                user:newUser[0]
            }
        });
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const {email,password} = req.body;
        const user = await User.findOne({email:email});
        // Check if the user exists
        if(!user){
            const error = Error("User not found");
            error.statusCode = 401;
            throw error;
        }
        // Check if the password is valid
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            const error = Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }
        // Generate a token
        const token = await jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRE});
        res.status(200).json({
            success:true,
            message:"User signed In successfully",
            data:{
                token,
                user
            }
        });
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signOut = async (req, res) => {
    res.send({title:"Sign Out route"});
}