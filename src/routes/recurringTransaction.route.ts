import { RecurringTransactionRepository } from "@/repositories";
import { paramsIdSchema } from "@/schemas";
import { accountIdSchema } from "@/schemas/common.schema";
import {
  recurringTransactionCreateSchema,
  recurringTransactionUpdateSchema,
} from "@/schemas/recurringTransaction.schema";
import { RecurringTransactionUseCase } from "@/usecases";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

function parseParams<T>(
  schema: z.ZodSchema<T>,
  params: unknown,
  reply: FastifyReply
): T | null {
  const result = schema.safeParse(params);
  if (!result.success) {
    reply.code(400).send({
      message: "Parâmetros inválidos",
      errors: result.error.errors,
    });
    return null;
  }
  return result.data;
}

async function recurringTransactionRoutes(server: FastifyInstance) {
  const recurringTransactionRepository = new RecurringTransactionRepository();
  const recurringTransactionUseCase = new RecurringTransactionUseCase(
    recurringTransactionRepository
  );

  server.get(
    "/account/:accountId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = parseParams(accountIdSchema, request.params, reply);
      if (!params) return;

      try {
        const transactions = await recurringTransactionUseCase.findByAccount(
          params.accountId
        );
        reply.send(transactions);
      } catch {
        reply.code(500).send({ message: "Erro interno do servidor" });
      }
    }
  );

  server.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const result = recurringTransactionCreateSchema.safeParse(request.body);
    if (!result.success) {
      reply.code(400).send({
        message: "Falha de validação",
        errors: result.error.errors,
      });
      return;
    }

    try {
      const transaction = await recurringTransactionUseCase.create(result.data);
      reply.code(201).send(transaction);
    } catch (error) {
      reply.code(500).send({
        message: error instanceof Error ? error.message : "Erro inesperado",
      });
    }
  });

  server.put("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const params = parseParams(paramsIdSchema, request.params, reply);
    if (!params) return;

    const body = recurringTransactionUpdateSchema.safeParse(request.body);
    if (!body.success) {
      reply.code(400).send({
        message: "Falha de validação",
        errors: body.error.errors,
      });
      return;
    }

    try {
      const updatedTransaction = await recurringTransactionUseCase.update(
        params.id,
        body.data
      );
      reply.send(updatedTransaction);
    } catch (error) {
      reply.code(500).send({
        message: error instanceof Error ? error.message : "Erro inesperado",
      });
    }
  });

  server.delete(
    "/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = parseParams(paramsIdSchema, request.params, reply);
      if (!params) return;

      try {
        const deleted = await recurringTransactionUseCase.delete(params.id);
        if (!deleted)
          return reply
            .code(404)
            .send({ message: "Transação recorrente não encontrada" });
        reply.code(204).send();
      } catch (error) {
        reply.code(500).send({
          message: error instanceof Error ? error.message : "Erro inesperado",
        });
      }
    }
  );
}

export default recurringTransactionRoutes;
