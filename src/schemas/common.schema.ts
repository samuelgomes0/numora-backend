import { z } from "zod";

export const paramsIdSchema = z.object({
  id: z.string().uuid("Invalid ID"),
});

export const paramsEmailSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const userIdSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

export const accountIdSchema = z.object({
  accountId: z.string().uuid("Invalid account ID"),
});

export const categoryIdSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
});

export const goalIdSchema = z.object({
  goalId: z.string().uuid("Invalid goal ID"),
});

export const budgetIdSchema = z.object({
  budgetId: z.string().uuid("Invalid budget ID"),
});

export const recurringTransactionIdSchema = z.object({
  recurringTransactionId: z.string().uuid("Invalid recurring transaction ID"),
});
