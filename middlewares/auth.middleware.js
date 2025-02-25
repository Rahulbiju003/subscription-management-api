import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../config/env.js';
import User from '../models/user.model.js';

const autherize = async (req, res, next) => {
    try{
        let token;
        // Check if token is in the header
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token){
            const error = new Error('Not authorized to access this route');
            error.statusCode = 401;
            throw error;
        }
        // Verify token
        const decoded = jwt.verify(token,JWT_SECRET);
        // Find user with the token
        const user = await User.findById(decoded.userId);

        if(!user){
            const error = new Error('No user found with this id');
            error.statusCode = 404;
            throw error;
        }
        // Set user in the request object
        req.user = user;
        // Call next middleware
        next();
    }catch(error){
        res.status(401).json({success:false,message:error.message});
    }
}

export default autherize;