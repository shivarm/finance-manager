import { Router } from "express";
import { apiLimit } from "../middlewares/rateLimit.js"
import { register } from "../controllers/authController.js";

const router = Router();

router.post("/register", apiLimit, register);

export default router;

