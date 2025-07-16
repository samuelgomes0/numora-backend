import { Frequency, TransactionType } from "@prisma/client";
import { z } from "zod";

export const recurringTransactionCreateSchema = z.object({
  accountId: z.string().uuid("ID da conta deve ser um UUID válido"),
  categoryId: z
    .string()
    .uuid("ID da categoria deve ser um UUID válido")
    .optional()
    .nullable(),
  amount: z.number().positive("Valor deve ser maior que zero"),
  transactionType: z.nativeEnum(TransactionType, {
    errorMap: () => ({ message: "Tipo de transação inválido" }),
  }),
  description: z.string().optional().nullable(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  frequency: z.nativeEnum(Frequency, {
    errorMap: () => ({ message: "Frequência inválida" }),
  }),
});

export const recurringTransactionUpdateSchema = z.object({
  amount: z.number().positive("Valor deve ser maior que zero").optional(),
  transactionType: z
    .nativeEnum(TransactionType, {
      errorMap: () => ({ message: "Tipo de transação inválido" }),
    })
    .optional(),
  description: z.string().optional().nullable(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional().nullable(),
  frequency: z
    .nativeEnum(Frequency, {
      errorMap: () => ({ message: "Frequência inválida" }),
    })
    .optional(),
});
