import mongoose from "mongoose";

const allErrorsHandler = (error, req, res, next) =>{
    console.error(error.stack);
    res.status(500).json({success:false, message: "error occured, see the errorMessage key for more details", errorMessage: error.message});
}

export default allErrorsHandler;