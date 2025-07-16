import { TransactionType } from "@prisma/client";
import z from "zod";

export const transactionCreateSchema = z.object({
  amount: z.number().positive("Valor deve ser maior que 0"),
  transactionType: z.nativeEnum(TransactionType, {
    errorMap: () => ({ message: "Tipo de transação inválido" }),
  }),
  description: z.string().nullable().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Formato de data inválido",
  }),
  accountId: z.string().uuid("ID da conta deve ser um UUID válido"),
  categoryId: z
    .string()
    .uuid("ID da categoria deve ser um UUID válido")
    .optional()
    .nullable(),
});

export const transactionUpdateSchema = transactionCreateSchema.partial();
