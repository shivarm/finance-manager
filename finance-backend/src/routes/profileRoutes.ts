import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddlewares.js";
import { apiLimit } from "../middlewares/rateLimit.js";
import { upload } from "../middlewares/upload.js";

import {
  getProfile,
  getAvatar,
  updateProfile,
  uploadAvatar,
  exportData,
  deleteAccount,
} from "../controllers/profileController.js";

const router = Router();

router.get("/", apiLimit, requireAuth, getProfile);
router.put("/", apiLimit, requireAuth, updateProfile);
router.post("/avatar", apiLimit, requireAuth, upload.single("avatar"), uploadAvatar);
router.get("/avatar", apiLimit, requireAuth, getAvatar);
router.get("/export", requireAuth, exportData);
router.delete("/account", requireAuth, deleteAccount);

export default router;
