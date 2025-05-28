import { TransactionType } from "@prisma/client";
import z from "zod";

export const transactionCreateSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  transactionType: z.nativeEnum(TransactionType),
  description: z.string().nullable().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  accountId: z.string().uuid(),
  categoryId: z.string().uuid().optional().nullable(),
});

export const transactionUpdateSchema = transactionCreateSchema.partial();
