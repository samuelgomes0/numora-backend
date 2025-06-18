import { z } from "zod";

export const goalCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  targetAmount: z.number().positive("Target amount must be greater than zero"),
  deadline: z.coerce.date().optional(),
  userId: z.string().uuid("Invalid user ID"),
});

export const goalUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  targetAmount: z.number().positive().optional(),
  deadline: z.coerce.date().optional(),
});
