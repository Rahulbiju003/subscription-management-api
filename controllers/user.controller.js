import User from '../models/user.model.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({success:true,data:users});
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({success:true,data:user});
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    try{
        const userId = req.params.id;
        const { name, email } = req.body;
        
        if(!name && !email){
            const error = new Error('Please provide name and email');
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findById(userId);

        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        if(user.name == name || user.email == email ||(user.name == name && user.email == email)){
            const error = new Error('Nothing to update');
            error.statusCode = 400;
            throw error;
        }

        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({success:true,data:user});
    }catch(error){
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });

    } catch (error) {
        next(error);
    }
};