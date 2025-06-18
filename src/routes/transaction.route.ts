import { TransactionRepository } from "@/repositories";
import { paramsIdSchema, transactionCreateSchema, transactionUpdateSchema } from "@/schemas";
import { accountIdSchema } from "@/schemas/common.schema";
import { TransactionUseCase } from "@/usecases";
import { FastifyInstance } from "fastify";
import z from "zod";

async function transactionRoutes(server: FastifyInstance) {
  const transactionRepository = new TransactionRepository();
  const transactionUseCase = new TransactionUseCase(transactionRepository);

  const parseParams = <T>(schema: z.ZodSchema<T>, params: unknown, reply: any): T | null => {
    const result = schema.safeParse(params);
    if (!result.success) {
      reply.status(400).send({
        message: "Invalid parameters",
        errors: result.error.errors,
      });
      return null;
    }
    return result.data;
  };

  server.get("/:id", async (request, reply) => {
    const data = parseParams(paramsIdSchema, request.params, reply);
    if (!data) return;

    try {
      const transaction = await transactionUseCase.findById(data.id);
      if (!transaction) return reply.status(404).send({ message: "Transaction not found" });
      reply.send(transaction);
    } catch {
      reply.status(500).send({ message: "Internal server error" });
    }
  });

  server.get("/account/:accountId", async (request, reply) => {
    const data = parseParams(accountIdSchema, request.params, reply);
    if (!data) return;

    try {
      const transactions = await transactionUseCase.findByAccount(data.accountId);
      reply.send(transactions);
    } catch {
      reply.status(500).send({ message: "Internal server error" });
    }
  });

  server.post("/", async (request, reply) => {
    try {
      const body = transactionCreateSchema.parse(request.body);
      const transaction = await transactionUseCase.create({
        ...body,
        date: new Date(body.date),
      });
      reply.status(201).send(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: "Validation failed",
          errors: error.errors,
        });
      }
      reply.status(500).send({ message: "Internal server error" });
    }
  });

  server.put("/:id", async (request, reply) => {
    const data = parseParams(paramsIdSchema, request.params, reply);
    if (!data) return;

    try {
      const body = transactionUpdateSchema.parse(request.body);
      const updated = await transactionUseCase.update(data.id, {
        ...body,
        date: body.date ? new Date(body.date) : undefined,
      });
      reply.send(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: "Validation failed",
          errors: error.errors,
        });
      }
      reply.status(500).send({ message: "Internal server error" });
    }
  });

  server.delete("/:id", async (request, reply) => {
    const data = parseParams(paramsIdSchema, request.params, reply);
    if (!data) return;

    try {
      const deleted = await transactionUseCase.delete(data.id);
      if (!deleted) return reply.status(404).send({ message: "Transaction not found" });
      reply.status(204).send();
    } catch {
      reply.status(500).send({ message: "Internal server error" });
    }
  });
}

export default transactionRoutes;
