import { z } from "zod";
import { ExpenseCategory } from "../types/index.js";

export const financeSchema = z.object({
  amount: z.number().min(1),
  category: z.enum(ExpenseCategory),
  description: z.string().trim(),
  date: z.date(),
});
