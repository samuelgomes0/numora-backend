import z from "zod";

const accountIdSchema = z.object({
  accountId: z.string().uuid(),
});

const paramsEmailSchema = z.object({
  email: z.string().email("Invalid email format"),
});

const paramsIdSchema = z.object({
  id: z.string().uuid("Invalid UUID"),
});

const paramsUserIdSchema = z.object({ userId: z.string().uuid() });

export {
  accountIdSchema,
  paramsEmailSchema,
  paramsIdSchema,
  paramsUserIdSchema,
};
