import mongoose, { Schema } from "mongoose";
import { IExpense } from "../types/index.js";

const financeSchema = new Schema<IExpense>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
    },
 
    category: {
      type: String,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
    },

    date: {
      type: Date,
    },
  },

  {
    timestamps: true,
  },
);

const Finance = mongoose.models.Finance || mongoose.model("Finance", financeSchema);
export default Finance;
