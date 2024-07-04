import express from "express";
import { param } from "express-validator";
import RestaurantController from "../controllers/RestaurantController";

const router=express.Router();
//api/restaurant/search/bajpe
router.get("/search/:city",param("city").isString().trim().notEmpty().withMessage("City paramater must be a valid String"),
RestaurantController.searchRestaurant);
//whenever eh clicks go for controller fn  forwardd onto the restaurantcontroller of search restaurants 
//whatever city orrr ee country if he searches he will ge tit latetr 
export default router;