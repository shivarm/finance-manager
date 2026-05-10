import { Router } from "express";
import {
  getAllExpense,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../controllers/financeController.js";
import { requireAuth } from "../middlewares/authMiddlewares.js"
import { apiLimit } from "../middlewares/rateLimit.js";

const router = Router();

router.get("/", apiLimit, requireAuth, getAllExpense);
router.get("/:id", apiLimit, requireAuth, getExpenseById);
router.post("/", apiLimit, requireAuth, createExpense);
router.put("/:id", apiLimit, requireAuth, updateExpense);
router.delete("/:id", apiLimit, requireAuth, deleteExpense);

export default router;
