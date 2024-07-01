import express,{Request,Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute"
// flow is like index to route from route to controller 

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=>console.log("connected to databse"));
const app= express();
app.use(express.json());
app.use(cors());
app.get("/health",async(req:Request,res:Response) =>{
    res.send({message:"Health ok!"});
})
//api for the user ur creating 
app.use("/api/my/user",myUserRoute);


// app.get("/test",async (req:Request, res:Response) =>{
// res.json({message:"Hello world!"});
// });
app.listen(7000,()=>{
    console.log("Server is running on port 7000");
 });