import { BudgetRepository } from "@/repositories";
import {
  budgetCreateSchema,
  budgetUpdateSchema,
  paramsIdSchema,
  userIdSchema,
} from "@/schemas";
import { BudgetUseCase } from "@/usecases";
import { parseParams } from "@/utils";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

async function budgetRoutes(server: FastifyInstance) {
  const budgetRepository = new BudgetRepository();
  const budgetUseCase = new BudgetUseCase(budgetRepository);

  server.get(
    "/user/:userId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = parseParams(userIdSchema, request.params, reply);
      if (!params) return;

      try {
        const budgets = await budgetUseCase.findByUser(params.userId);
        reply.send(budgets);
      } catch {
        reply.code(500).send({ message: "Erro interno do servidor" });
      }
    }
  );

  server.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const result = budgetCreateSchema.safeParse(request.body);
    if (!result.success) {
      reply.code(400).send({
        message: "Falha de validação",
        errors: result.error.errors,
      });
      return;
    }

    try {
      const budget = await budgetUseCase.create(result.data);
      reply.code(201).send(budget);
    } catch (error) {
      reply.code(500).send({
        message: error instanceof Error ? error.message : "Erro inesperado",
      });
    }
  });

  server.put("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const params = parseParams(paramsIdSchema, request.params, reply);
    if (!params) return;

    const body = budgetUpdateSchema.safeParse(request.body);
    if (!body.success) {
      reply.code(400).send({
        message: "Falha de validação",
        errors: body.error.errors,
      });
      return;
    }

    try {
      const updatedBudget = await budgetUseCase.update(params.id, body.data);
      reply.send(updatedBudget);
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
        const deleted = await budgetUseCase.delete(params.id);
        if (!deleted)
          return reply.code(404).send({ message: "Orçamento não encontrado" });
        reply.code(204).send();
      } catch (error) {
        reply.code(500).send({
          message: error instanceof Error ? error.message : "Erro inesperado",
        });
      }
    }
  );
}

export default budgetRoutes;
