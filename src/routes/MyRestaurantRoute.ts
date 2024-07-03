import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

router.get("/", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurant);

router.post(
  "/",
  jwtCheck,
  jwtParse,
  upload.single("imageFile"),
  MyRestaurantController.createMyRestaurant
);

router.put(
  "/",
  jwtCheck,
  jwtParse,
  upload.single("imageFile"),
  MyRestaurantController.updateMyRestaurant // Use the correct method
);

export default router;
