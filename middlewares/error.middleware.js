const errorMiddleware = (err, req, res, next) => {
    try{
        //deconstructing the error object
        let error = { ...err };

        //setting the error message
        error.message = err.message;

        //log to console for dev
        console.error(err);

        //mongoose bad object id
        if (err.name === 'CastError') {
            const message = `Resource not found`;
            error = new Error(message, 404);
        }

        //mongoose duplicate key
        if (err.code === 11000) {
            const message = `Duplicate field value entered`;
            error = new Error(message, 400);
        }

        //mongoose validation error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(', '), 400);
        }

        //response
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    }catch(error){
        //sends the error to the next middleware
        next(error);
    }
}

export default errorMiddleware;