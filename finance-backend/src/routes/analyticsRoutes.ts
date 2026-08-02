import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddlewares.js";
import { apiLimit } from "../middlewares/rateLimit.js";

import {
getExpensesByCategories,
getMonthlyTotals,
getDashboardStats,
getSpendingTrends,
getPeriodStats,
getCurrentMonthExpenses,
getYearlyCategoryStats,
getAllYears
} from "../controllers/analyticsController.js"

const router = Router();

router.get("/category", apiLimit, requireAuth, getExpensesByCategories);
router.get("/monthly", apiLimit, requireAuth, getMonthlyTotals);
router.get("/dashboard", apiLimit, requireAuth, getDashboardStats);
router.get("/trends", apiLimit, requireAuth, getSpendingTrends);
router.get("/period", apiLimit, requireAuth, getPeriodStats);
router.get("/current-month", apiLimit, requireAuth, getCurrentMonthExpenses);
router.get("/yearly-categories", apiLimit, requireAuth, getYearlyCategoryStats);
router.get("/all-years", apiLimit, requireAuth, getAllYears);

export default router;