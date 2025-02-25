import Subscription from '../models/subscription.model.js';
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL } from '../config/env.js';

export const createSubscription = async ( req, res, next ) => {
    try{
        const subscription = await Subscription.create({
            ...req.body,
            user : req.user._id,
        });

        await workflowClient.trigger({
            url:`${SERVER_URL}/api/v1/workflows/subscription/remainder`,   
            body:{
                subscriptionID:subscription._id,
            },
            headers:{
                'Content-Type':'application/json',
            },
            retries:0
        })

        res.status(201).json({
            success:true,
            data:subscription,
        });
    }catch(error){
        next(error);
    }
}

export const getUserSubscriptions = async ( req, res, next ) => {
    try{
        if(req.user.id !== req.params.id){
            throw new Error('You Are not the owner of this account');
        }
        const subscriptions = await Subscription.find({user:req.params.id});
        res.status(200).json({
            success:true,
            data:subscriptions,
        });
    }catch(error){
        next(error);
    }
}

export const getAllSubscriptions = async ( req, res, next ) => {
    try{
        const subscriptions = await Subscription.find();
        res.status(200).json({
            success:true,
            data:subscriptions,
        });
    }catch(error){
        next(error);
    }
}

export const getSubcriptionDetails = async ( req, res, next ) => {
    try{
        if(req.user.id !== req.params.id){
            throw new Error('You are not authorized to get these details');
        }
        const subscription =await Subscription.find({user:req.params.id});
        res.status(200).json({
            success:true,
            data:subscription,
        }); 
    }catch(error){  
        next(error);
    }
}