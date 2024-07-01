import { body, validationResult } from "express-validator";
import {Request,Response,NextFunction} from "express";
const handleValidationErrors=async(req:Request,res:Response,next:NextFunction)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
    
    }
next();//this means that fn is pase d to controller fn such tha tu c an udate the user profile mate 
}
export const validateMyUserRequest=[
body("name").isString().notEmpty().withMessage("Name must b a string"),
body("addressLine1").isString().notEmpty().withMessage("Address must be a string"),
body("city").isString().notEmpty().withMessage("City must be a string"),
body("country").isString().notEmpty().withMessage("Country must be a string"),
handleValidationErrors,//add the errors if it is there 
];

// all the validations are wrritien here that everything shoudl be correct or not 