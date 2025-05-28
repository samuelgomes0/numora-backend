import z from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  accountId: z.string().uuid(),
});

export const categoryUpdateSchema = z.object({
  name: z.string().min(1).optional(),
});
