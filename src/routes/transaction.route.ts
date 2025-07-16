import { TransactionRepository } from "@/repositories";
import {
  paramsIdSchema,
  transactionCreateSchema,
  transactionUpdateSchema,
} from "@/schemas";
import { accountIdSchema } from "@/schemas/common.schema";
import { TransactionUseCase } from "@/usecases";
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

async function transactionRoutes(server: FastifyInstance) {
  const transactionRepository = new TransactionRepository();
  const transactionUseCase = new TransactionUseCase(transactionRepository);

  server.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const params = parseParams(paramsIdSchema, request.params, reply);
    if (!params) return;

    try {
      const transaction = await transactionUseCase.findById(params.id);
      if (!transaction)
        return reply.code(404).send({ message: "Transação não encontrada" });
      reply.send(transaction);
    } catch {
      reply.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  server.get(
    "/account/:accountId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = parseParams(accountIdSchema, request.params, reply);
      if (!params) return;

      try {
        const transactions = await transactionUseCase.findByAccount(
          params.accountId
        );
        reply.send(transactions);
      } catch {
        reply.code(500).send({ message: "Erro interno do servidor" });
      }
    }
  );

  server.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const result = transactionCreateSchema.safeParse(request.body);
    if (!result.success) {
      reply.code(400).send({
        message: "Falha de validação",
        errors: result.error.errors,
      });
      return;
    }

    try {
      const transaction = await transactionUseCase.create({
        ...result.data,
        date: new Date(result.data.date),
      });
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

    const body = transactionUpdateSchema.safeParse(request.body);
    if (!body.success) {
      reply.code(400).send({
        message: "Falha de validação",
        errors: body.error.errors,
      });
      return;
    }

    try {
      const updatedTransaction = await transactionUseCase.update(params.id, {
        ...body.data,
        date: body.data.date ? new Date(body.data.date) : undefined,
      });
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
        const deleted = await transactionUseCase.delete(params.id);
        if (!deleted)
          return reply.code(404).send({ message: "Transação não encontrada" });
        reply.code(204).send();
      } catch (error) {
        reply.code(500).send({
          message: error instanceof Error ? error.message : "Erro inesperado",
        });
      }
    }
  );
}

export default transactionRoutes;
