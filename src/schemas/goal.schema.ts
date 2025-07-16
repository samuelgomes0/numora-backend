import { z } from "zod";

export const goalCreateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  targetAmount: z.number().positive("Valor alvo deve ser maior que zero"),
  deadline: z.coerce.date().optional(),
  userId: z.string().uuid("ID do usuário deve ser um UUID válido"),
});

export const goalUpdateSchema = z.object({
  name: z.string().min(1, "Nome deve ter pelo menos 1 caractere").optional(),
  targetAmount: z
    .number()
    .positive("Valor alvo deve ser maior que zero")
    .optional(),
  deadline: z.coerce.date().optional(),
});
