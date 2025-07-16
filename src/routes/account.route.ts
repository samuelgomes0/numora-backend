import { AccountRepository } from "@/repositories";
import {
  accountCreateSchema,
  accountUpdateSchema,
  paramsIdSchema,
  userIdSchema,
} from "@/schemas";
import { AccountUseCase } from "@/usecases";
import { parseParams } from "@/utils";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

async function accountRoutes(server: FastifyInstance) {
  const accountRepository = new AccountRepository();
  const accountUseCase = new AccountUseCase(accountRepository);

  server.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const params = parseParams(paramsIdSchema, request.params, reply);
    if (!params) return;

    try {
      const account = await accountUseCase.findById(params.id);
      if (!account)
        return reply.code(404).send({ message: "Conta não encontrada" });
      reply.send(account);
    } catch {
      reply.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  server.get(
    "/user/:userId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = parseParams(userIdSchema, request.params, reply);
      if (!params) return;

      try {
        const accounts = await accountUseCase.findByUser(params.userId);
        reply.send(accounts);
      } catch {
        reply.code(500).send({ message: "Erro interno do servidor" });
      }
    }
  );

  server.get(
    "/:id/balance",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = parseParams(paramsIdSchema, request.params, reply);
      if (!params) return;

      try {
        const balance = await accountUseCase.getBalance(params.id);
        if (balance === null)
          return reply.code(404).send({ message: "Conta não encontrada" });
        reply.send({ balance });
      } catch {
        reply.code(500).send({ message: "Erro interno do servidor" });
      }
    }
  );

  server.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const result = accountCreateSchema.safeParse(request.body);
    if (!result.success) {
      reply.code(400).send({
        message: "Falha de validação",
        errors: result.error.errors,
      });
      return;
    }

    try {
      const account = await accountUseCase.create(result.data);
      reply.code(201).send(account);
    } catch (error) {
      reply.code(500).send({
        message: error instanceof Error ? error.message : "Erro inesperado",
      });
    }
  });

  server.put("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const params = parseParams(paramsIdSchema, request.params, reply);
    if (!params) return;

    const body = accountUpdateSchema.safeParse(request.body);
    if (!body.success) {
      reply.code(400).send({
        message: "Falha de validação",
        errors: body.error.errors,
      });
      return;
    }

    try {
      const updatedAccount = await accountUseCase.update(params.id, body.data);
      if (!updatedAccount)
        return reply.code(404).send({ message: "Conta não encontrada" });
      reply.send(updatedAccount);
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
        const deleted = await accountUseCase.delete(params.id);
        if (!deleted)
          return reply.code(404).send({ message: "Conta não encontrada" });
        reply.code(204).send();
      } catch (error) {
        reply.code(500).send({
          message: error instanceof Error ? error.message : "Erro inesperado",
        });
      }
    }
  );
}

export default accountRoutes;
