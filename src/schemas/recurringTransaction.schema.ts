import { Frequency, TransactionType } from "@prisma/client";
import { z } from "zod";

export const recurringTransactionCreateSchema = z.object({
  accountId: z.string().uuid("Invalid account ID"),
  categoryId: z.string().uuid("Invalid category ID").optional().nullable(),
  amount: z.number().positive("Amount must be greater than zero"),
  transactionType: z.nativeEnum(TransactionType),
  description: z.string().optional().nullable(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  frequency: z.nativeEnum(Frequency),
});

export const recurringTransactionUpdateSchema = z.object({
  amount: z.number().positive().optional(),
  transactionType: z.nativeEnum(TransactionType).optional(),
  description: z.string().optional().nullable(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional().nullable(),
  frequency: z.nativeEnum(Frequency).optional(),
});
