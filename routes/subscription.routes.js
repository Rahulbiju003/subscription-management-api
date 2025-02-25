import { Router } from 'express';
import autherize from '../middlewares/auth.middleware.js';
import { createSubscription, getUserSubscriptions, getAllSubscriptions, getSubcriptionDetails } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/',getAllSubscriptions);

subscriptionRouter.get('/:id',autherize,getSubcriptionDetails);

subscriptionRouter.post('/',autherize,createSubscription);

subscriptionRouter.put('/:id',(req,res)=>{
    res.send({
        title:'UPDATE subscription'
    })
});

subscriptionRouter.delete('/:id',(req,res)=>{
    res.send({
        title:'DELETE subscription'
    })
});

subscriptionRouter.get('/user/:id',autherize,getUserSubscriptions);

subscriptionRouter.put('/:id/cancel',(req,res)=>{
    res.send({
        title:'Cancel subscriptions'
    })
});


export default subscriptionRouter;