import {Request,Response} from "express";
import User from "../models/user";
const getCurrentUser=async(req:Request,res:Response)=>
{
    try{
        const currentUser=await User.findOne({_id:req.userId});
        if(!currentUser){
            return res.status(404).json({message:"User not found"});
        }
        res.json(currentUser);
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Something went wrong"});
        
    }
};
const createCurrentUser=async(req:Request,res:Response)=>{
    //1 check if the user exists
    //create the user if not exists
    //return the user object to calling clienr
    try{
        //auth0id should be captured by the frontend 
        const {auth0Id} = req.body;
        const existingUser=await User.findOne({auth0Id});
        if(existingUser) {
        //if it is exists then u give the corresponding thing back 
        return res.status(200).send();

        }
        const newUser=new User(req.body);
        await newUser.save();
        res.status(201).json(newUser.toObject());
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Eror creating the user"});
        
    }

};
const updateCurrentUser = async(req:Request,res:Response)=>{
    try{
        const {name,addressLine1,country,city}=req.body;
        const user=await User.findById(req.userId);
        // the id we fetch whichuser we have to update or auth0 acces his id 
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        user.name=name;
        user.addressLine1=addressLine1;
        user.country=country;
        user.city=city;
        await user.save();
        res.send(user);
    }catch(error){
console.log(error);
res.status(500).json({message:"Error updating user"});

    }
}
export default {getCurrentUser,createCurrentUser,updateCurrentUser};
// we want to update the user 4 infor not whole like authid and mail id 