import z from "zod";

const createUserSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters long",
    })
    .max(255, {
      message: "Name must be at most 255 characters long",
    }),
  email: z.string().email({
    message: "Email must be a valid email address",
  }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(32, {
      message: "Password must be at most 32 characters long",
    }),
});

export { createUserSchema };
