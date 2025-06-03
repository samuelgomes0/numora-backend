import { TransactionRepository } from "@/repositories";
import { paramsIdSchema } from "@/schemas";
import { accountIdSchema } from "@/schemas/common.schema";
import {
  transactionCreateSchema,
  transactionUpdateSchema,
} from "@/schemas/transaction.schema";
import { TransactionUseCase } from "@/usecases";

import { FastifyInstance } from "fastify";
import z from "zod";

async function transactionRoutes(server: FastifyInstance) {
  const transactionRepository = new TransactionRepository();
  const transactionUseCase = new TransactionUseCase(transactionRepository);

  // GET /transactions/:id
  server.get("/:id", async (request, reply) => {
    const result = paramsIdSchema.safeParse(request.params);
    if (!result.success) {
      return reply.status(400).send({
        message: "Invalid transaction ID",
        errors: result.error.errors,
      });
    }

    try {
      const transaction = await transactionUseCase.findById(result.data.id);
      if (!transaction) {
        return reply.status(404).send({ message: "Transaction not found" });
      }
      return reply.send(transaction);
    } catch {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });

  // GET /transactions/account/:accountId
  server.get("/account/:accountId", async (request, reply) => {
    const result = accountIdSchema.safeParse(request.params);

    if (!result.success) {
      return reply.status(400).send({
        message: "Invalid account ID",
        errors: result.error.errors,
      });
    }

    try {
      const transactions = await transactionUseCase.findByAccount(
        result.data.accountId
      );
      return reply.send(transactions);
    } catch {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });

  // POST /transactions
  server.post("/", async (request, reply) => {
    try {
      const data = transactionCreateSchema.parse(request.body);
      const transaction = await transactionUseCase.create({
        ...data,
        date: new Date(data.date),
      });
      return reply.status(201).send(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: "Validation failed",
          errors: error.errors,
        });
      }
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });

  // PUT /transactions/:id
  server.put("/:id", async (request, reply) => {
    const result = paramsIdSchema.safeParse(request.params);
    if (!result.success) {
      return reply.status(400).send({
        message: "Invalid transaction ID",
        errors: result.error.errors,
      });
    }

    try {
      const data = transactionUpdateSchema.parse(request.body);
      const updatedTransaction = await transactionUseCase.update(
        result.data.id,
        { ...data, date: data.date ? new Date(data.date) : undefined }
      );
      return reply.send(updatedTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: "Validation failed",
          errors: error.errors,
        });
      }
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });

  // DELETE /transactions/:id
  server.delete("/:id", async (request, reply) => {
    const result = paramsIdSchema.safeParse(request.params);
    if (!result.success) {
      return reply.status(400).send({
        message: "Invalid transaction ID",
        errors: result.error.errors,
      });
    }

    try {
      const deleted = await transactionUseCase.delete(result.data.id);
      if (!deleted) {
        return reply.status(404).send({ message: "Transaction not found" });
      }
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          message: "Validation failed",
          errors: error.errors,
        });
      }
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}

export default transactionRoutes;
