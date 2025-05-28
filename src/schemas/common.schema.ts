import z from "zod";

export const paramsIdSchema = z.object({
  id: z.string().uuid("Invalid UUID"),
});

export const paramsEmailSchema = z.object({
  email: z.string().email("Invalid email format"),
});
