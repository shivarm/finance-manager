import { Router } from "express";
import { apiLimit } from "../middlewares/rateLimit.js"
import { register, login } from "../controllers/authController.js";

const router = Router();

router.post("/register", apiLimit, register);
router.post("/login", apiLimit, login);

export default router;

