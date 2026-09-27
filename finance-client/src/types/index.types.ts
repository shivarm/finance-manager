export const ExpenseCategory = {
  FOOD: "food",
  TRANSPORT: "transport",
  UTILITIES: "utilities",
  ENTERTAINMENT: "entertainment",
  HEALTHCARE: "healthcare",
  SHOPPING: "shopping",
  EDUCATION: "education",
  OTHER: "other",
} as const;

export type ExpenseCategory = (typeof ExpenseCategory)[keyof typeof ExpenseCategory];

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}