import { Router } from 'express';
import autherize from '../middlewares/auth.middleware.js';
import {getAllUsers, getUser, updateUser, deleteUser} from '../controllers/user.controller.js';

const userRouter = Router();

userRouter.get("/",getAllUsers)

userRouter.get("/:id",autherize,getUser)

userRouter.put("/:id",autherize,updateUser)

userRouter.delete("/:id",deleteUser)

export default userRouter;