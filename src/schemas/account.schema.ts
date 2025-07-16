import z from "zod";

export const accountCreateSchema = z.object({
  userId: z.string().uuid("ID do usuário deve ser um UUID válido"),
  name: z.string().min(1, "Nome é obrigatório"),
});

export const accountUpdateSchema = z.object({
  name: z.string().min(1, "Nome deve ter pelo menos 1 caractere").optional(),
});
