import { GoalRepository } from "@/repositories";
import { paramsIdSchema } from "@/schemas";
import { userIdSchema } from "@/schemas/common.schema";
import { goalCreateSchema, goalUpdateSchema } from "@/schemas/goal.schema";
import { GoalUseCase } from "@/usecases";
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

async function goalRoutes(server: FastifyInstance) {
  const goalRepository = new GoalRepository();
  const goalUseCase = new GoalUseCase(goalRepository);

  server.get(
    "/user/:userId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = parseParams(userIdSchema, request.params, reply);
      if (!params) return;

      try {
        const goals = await goalUseCase.findByUser(params.userId);
        reply.send(goals);
      } catch {
        reply.code(500).send({ message: "Erro interno do servidor" });
      }
    }
  );

  server.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const result = goalCreateSchema.safeParse(request.body);
    if (!result.success) {
      reply.code(400).send({
        message: "Falha de validação",
        errors: result.error.errors,
      });
      return;
    }

    try {
      const goal = await goalUseCase.create(result.data);
      reply.code(201).send(goal);
    } catch (error) {
      reply.code(500).send({
        message: error instanceof Error ? error.message : "Erro inesperado",
      });
    }
  });

  server.put("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const params = parseParams(paramsIdSchema, request.params, reply);
    if (!params) return;

    const body = goalUpdateSchema.safeParse(request.body);
    if (!body.success) {
      reply.code(400).send({
        message: "Falha de validação",
        errors: body.error.errors,
      });
      return;
    }

    try {
      const updatedGoal = await goalUseCase.update(params.id, body.data);
      reply.send(updatedGoal);
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
        const deleted = await goalUseCase.delete(params.id);
        if (!deleted)
          return reply.code(404).send({ message: "Meta não encontrada" });
        reply.code(204).send();
      } catch (error) {
        reply.code(500).send({
          message: error instanceof Error ? error.message : "Erro inesperado",
        });
      }
    }
  );
}

export default goalRoutes;
