import { AccountRepository } from "@/repositories";
import { paramsIdSchema } from "@/schemas";
import {
  accountCreateSchema,
  accountUpdateSchema,
} from "@/schemas/account.schema";
import { paramsUserIdSchema } from "@/schemas/common.schema";
import { AccountUseCase } from "@/usecases";

import { FastifyInstance } from "fastify";
import z from "zod";

async function accountRoutes(server: FastifyInstance) {
  const accountRepository = new AccountRepository();
  const accountUseCase = new AccountUseCase(accountRepository);

  // GET /accounts/:id
  server.get("/:id", async (request, reply) => {
    const result = paramsIdSchema.safeParse(request.params);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid account ID",
        errors: result.error.errors,
      });
    }

    try {
      const account = await accountUseCase.findById(result.data.id);
      if (!account) {
        return reply.code(404).send({ message: "Account not found" });
      }
      return reply.send(account);
    } catch {
      return reply.code(500).send({ message: "Internal server error" });
    }
  });

  // GET /accounts/user/:userId
  server.get("/user/:userId", async (request, reply) => {
    const result = paramsUserIdSchema.safeParse(request.params);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid user ID",
        errors: result.error.errors,
      });
    }

    try {
      const accounts = await accountUseCase.findByUser(result.data.userId);
      return reply.send(accounts);
    } catch {
      return reply.code(500).send({ message: "Internal server error" });
    }
  });

  // GET /accounts/:id/balance
  server.get("/:id/balance", async (request, reply) => {
    const result = paramsIdSchema.safeParse(request.params);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid account ID",
        errors: result.error.errors,
      });
    }

    try {
      const balance = await accountUseCase.getBalance(result.data.id);
      if (balance === null) {
        return reply.code(404).send({ message: "Account not found" });
      }
      return reply.send({ balance });
    } catch {
      return reply.code(500).send({ message: "Internal server error" });
    }
  });

  // POST /accounts
  server.post("/", async (request, reply) => {
    try {
      const data = accountCreateSchema.parse(request.body);
      const account = await accountUseCase.create(data);
      return reply.code(201).send(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          message: "Validation failed",
          errors: error.errors,
        });
      }
      return reply.code(500).send({ message: "Internal server error" });
    }
  });

  // PUT /accounts/:id
  server.put("/:id", async (request, reply) => {
    const result = paramsIdSchema.safeParse(request.params);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid account ID",
        errors: result.error.errors,
      });
    }

    try {
      const data = accountUpdateSchema.parse(request.body);
      const updated = await accountUseCase.update(result.data.id, data);
      if (!updated) {
        return reply.code(404).send({ message: "Account not found" });
      }
      return reply.send(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          message: "Validation failed",
          errors: error.errors,
        });
      }
      return reply.code(500).send({ message: "Internal server error" });
    }
  });

  // DELETE /accounts/:id
  server.delete("/:id", async (request, reply) => {
    const result = paramsIdSchema.safeParse(request.params);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid account ID",
        errors: result.error.errors,
      });
    }

    try {
      const deleted = await accountUseCase.delete(result.data.id);
      if (!deleted) {
        return reply.code(404).send({ message: "Account not found" });
      }
      return reply.code(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          message: "Validation failed",
          errors: error.errors,
        });
      }
      return reply.code(500).send({ message: "Internal server error" });
    }
  });
}

export default accountRoutes;
