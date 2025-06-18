import z from "zod";

export const budgetCreateSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  categoryId: z.string().uuid("Invalid category ID"),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  limit: z.number().positive("Budget limit must be greater than zero"),
});

export const budgetUpdateSchema = z.object({
  limit: z.number().positive("Budget limit must be greater than zero"),
});
