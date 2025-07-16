import z from "zod";

export const budgetCreateSchema = z.object({
  userId: z.string().uuid("ID do usuário deve ser um UUID válido"),
  categoryId: z.string().uuid("ID da categoria deve ser um UUID válido"),
  month: z
    .number()
    .int()
    .min(1, "Mês deve estar entre 1 e 12")
    .max(12, "Mês deve estar entre 1 e 12"),
  year: z
    .number()
    .int()
    .min(2000, "Ano deve estar entre 2000 e 2100")
    .max(2100, "Ano deve estar entre 2000 e 2100"),
  limit: z.number().positive("Limite do orçamento deve ser maior que zero"),
});

export const budgetUpdateSchema = z.object({
  limit: z.number().positive("Limite do orçamento deve ser maior que zero"),
});
