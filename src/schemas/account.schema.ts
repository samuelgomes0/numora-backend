import z from "zod";

export const accountCreateSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
});

export const accountUpdateSchema = z.object({
  name: z.string().min(1).optional(),
});
