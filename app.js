import express from 'express'
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDataBase from './DATABASE/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import workflowRoutes from './routes/workflow.routes.js';

// Create an express application
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

// Routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/subscriptions',subscriptionRouter);
app.use('/api/v1/workflows',workflowRoutes);

// Error Middleware
app.use(errorMiddleware);

//Home route
app.get('/',(req,res)=>{
    res.send("Welcome to the subdub");
});

// Listen on PORT
app.listen(PORT,async ()=>{
    console.log(`Server running on https://localhost:${PORT}`);

    await connectToDataBase();
});

export default app;