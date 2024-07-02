import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
// import { validateMyRestaurantRequest } from "../middleware/validation";  // Temporarily comment out this line

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// console.log("validateMyRestaurantRequest (import):", validateMyRestaurantRequest);

router.post(
  "/",
  //  validateMyRestaurantRequest,  // Temporarily comment out this line
  jwtCheck,
  jwtParse,
  upload.single("imageFile"),
  MyRestaurantController.createMyRestaurant
);

export default router;


