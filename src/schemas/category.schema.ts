import z from "zod";

export const categoryCreateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  accountId: z.string().uuid("ID da conta deve ser um UUID válido"),
});

export const categoryUpdateSchema = z.object({
  name: z.string().min(1, "Nome deve ter pelo menos 1 caractere").optional(),
});
