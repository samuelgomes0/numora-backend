import { AccountRepository } from "@/repositories";
import { accountCreateSchema, accountUpdateSchema, paramsIdSchema } from "@/schemas";
import { userIdSchema } from "@/schemas/common.schema";
import { AccountUseCase } from "@/usecases";
import { FastifyInstance } from "fastify";
import z from "zod";

async function accountRoutes(server: FastifyInstance) {
  const accountRepository = new AccountRepository();
  const accountUseCase = new AccountUseCase(accountRepository);

  function parseParams<T>(schema: z.ZodSchema<T>, params: unknown, reply: any): T | null {
    const result = schema.safeParse(params);
    if (!result.success) {
      reply.code(400).send({
        message: "Invalid parameters",
        errors: result.error.errors,
      });
      return null;
    }
    return result.data;
  }

  server.get("/:id", async (request, reply) => {
    const data = parseParams(paramsIdSchema, request.params, reply);
    if (!data) return;

    try {
      const account = await accountUseCase.findById(data.id);
      if (!account) return reply.code(404).send({ message: "Account not found" });
      reply.send(account);
    } catch {
      reply.code(500).send({ message: "Internal server error" });
    }
  });

  server.get("/user/:userId", async (request, reply) => {
    const data = parseParams(userIdSchema, request.params, reply);
    if (!data) return;

    try {
      const accounts = await accountUseCase.findByUser(data.userId);
      reply.send(accounts);
    } catch {
      reply.code(500).send({ message: "Internal server error" });
    }
  });

  server.get("/:id/balance", async (request, reply) => {
    const data = parseParams(paramsIdSchema, request.params, reply);
    if (!data) return;

    try {
      const balance = await accountUseCase.getBalance(data.id);
      if (balance === null) return reply.code(404).send({ message: "Account not found" });
      reply.send({ balance });
    } catch {
      reply.code(500).send({ message: "Internal server error" });
    }
  });

  server.post("/", async (request, reply) => {
    try {
      const body = accountCreateSchema.parse(request.body);
      const account = await accountUseCase.create(body);
      reply.code(201).send(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ message: "Validation failed", errors: error.errors });
      }
      reply.code(500).send({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  });

  server.put("/:id", async (request, reply) => {
    const data = parseParams(paramsIdSchema, request.params, reply);
    if (!data) return;

    try {
      const body = accountUpdateSchema.parse(request.body);
      const updated = await accountUseCase.update(data.id, body);
      if (!updated) return reply.code(404).send({ message: "Account not found" });
      reply.send(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ message: "Validation failed", errors: error.errors });
      }
      reply.code(500).send({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  });

  server.delete("/:id", async (request, reply) => {
    const data = parseParams(paramsIdSchema, request.params, reply);
    if (!data) return;

    try {
      const deleted = await accountUseCase.delete(data.id);
      if (!deleted) return reply.code(404).send({ message: "Account not found" });
      reply.code(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ message: "Validation failed", errors: error.errors });
      }
      reply.code(500).send({
        message: error instanceof Error ? error.message : "Internal server error",
      });
    }
  });
}

export default accountRoutes;
