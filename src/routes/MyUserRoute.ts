import express from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";
const router=express.Router();
//api/my/user
router.get("/",jwtCheck,jwtParse,MyUserController.getCurrentUser);
//when /api/my/user is been clicked it happend 

router.post("/",jwtCheck,MyUserController.createCurrentUser);
// for the updat eprofile w start it mate
router.put("/",jwtCheck,jwtParse,validateMyUserRequest,MyUserController.updateCurrentUser);

export default router;
// we created the user udate user now get the user from the end point 