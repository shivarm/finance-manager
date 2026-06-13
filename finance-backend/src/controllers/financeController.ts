import { NextFunction, Request, Response } from "express";
import { asyncHandler, sendSuccess } from "../utils/asyncHandler.js";
import { AppError } from "../middlewares/errorHandler.js";
import User from "../models/User.model.js";
import Finance from "../models/finance.model.js";
import { ExpenseCategory } from "../types/index.js";

export const getAllExpense = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // implement sort and filter
    const { category, sort } = req.query;

    const filter: { userId: string; category?: string } = {
      userId,
    };

    if (category && typeof category === "string") {
      filter.category = category;
    }

    let query = Finance.find(filter);

    if (sort && typeof sort === "string") {
      if (sort === "amount") {
        query = query?.sort({ amount: 1 });
      } else if (sort === "-amount") {
        query = query.sort({ amount: -1 });
      } else if (sort === "date") {
        query = query.sort({ date: 1 });
      } else if (sort === "-date") {
        query = query.sort({ date: -1 });
      }
    }

    const expenses = await query;

    sendSuccess(res, expenses, `Found ${expenses.length} expenses.`);
  },
);

export const getExpenseById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { id } = req.params;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const expense = await Finance.findById(id);

    if (!expense) {
      throw new AppError("Expense Not Found", 403)
    }

    if (expense.userId.toString() !== userId) {
      throw new AppError("Unauthorized access to this expense", 403);
    }

    sendSuccess(res, expense, `Found expense.`);

  },
);

export const createExpense = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { amount, category, description, date } = req.body;

    if (!amount || !category || !description) {
      throw new AppError("amount, category, description required", 400);
    }

    if (typeof amount !== "number") {
      throw new AppError("Amount must be  a number", 400);
    }

    if (amount > 1000000) {
      throw new AppError("Amount cannot exceed 1,000,000", 400);
    }

    const validCategories = Object.values(ExpenseCategory);

    if (!validCategories.includes(category)) {
      throw new AppError(`Invalid category. Must be on of: ${validCategories.join(", ")}`, 400);
    }

    if (description.length < 3) {
      throw new AppError("Description must be at least 3 characters", 400);
    }
    if (description.length > 100) {
      throw new AppError("Description cannot exceed 100 characters", 400);
    }

    const expenseDate = date ? new Date(date) : new Date();

    const today = new Date();

    if (expenseDate > today) {
      throw new AppError("Cannot create an expense for a future date", 400);
    }

     const newExpense = new Finance({
      userId: userId,
      amount,
      category,
      description,
      date: expenseDate,
    });

    const createdExpense = await newExpense.save();

    sendSuccess(res, createdExpense, "Expense created successfully!", 201);
  },
);

export const updateExpense = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { id } = req.params;
    const { amount, category, description, date } = req.body;

    const expense = await Finance.findById(id);

    if (!expense) {
      throw new AppError("Expense Not Found", 404);
    }

    if (expense.userId.toString() !== userId) {
      throw new AppError("Unauthorized access to this expense", 403);
    }

    // Validation - Provided Fields
    if (amount !== undefined) {
      if (typeof amount !== "number") {
        throw new AppError("Amount must be a number", 400);
      }

      if (amount <= 0) {
        throw new AppError("Amount must be greater than 0", 400);
      }

      if (amount > 1000000) {
        throw new AppError("Amount cannot exceed 1,000,000", 400);
      }
    }

    if (category !== undefined) {
      const validCategories = Object.values(ExpenseCategory);
      if (!validCategories.includes(category)) {
        throw new AppError(`Invalid category. Must be one of: ${validCategories.join(", ")}`, 400);
      }
    }

    if (description !== undefined) {
      if (description.length < 3) {
        throw new AppError("Description must be at least 3 characters", 400);
      }
      if (description.length > 100) {
        throw new AppError("Description cannot exceed 100 characters", 400);
      }
    }

    if (amount !== undefined) {
      expense.amount = amount;
    }

    if (category !== undefined) {
      expense.category = category;
    }

    if (description !== undefined) {
      expense.description = description;
    }

    if (date !== undefined) {
      expense.date = new Date(date);
    }

    const updatedExpense = await expense.save();

    sendSuccess(res, updatedExpense, "Expense updated successfully!");
  },
);

export const deleteExpense = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { id } = req.params;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new AppError("User Not Found", 400);
    }

    const expense = await Finance.findById(id);

    if (!expense) {
      throw new AppError("Expense not found", 404);
    }

    if (expense.userId.toString() !== userId) {
      throw new AppError("Unauthorized access to this expense", 403);
    }

    await Finance.findByIdAndDelete(id);

    sendSuccess(res, null, "Expense deleted successFully");
  },
);
