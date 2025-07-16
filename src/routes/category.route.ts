import { CategoryRepository } from "@/repositories";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
  paramsIdSchema,
} from "@/schemas";
import { accountIdSchema } from "@/schemas/common.schema";
import { CategoryUseCase } from "@/usecases";
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

async function categoryRoutes(server: FastifyInstance) {
  const categoryRepository = new CategoryRepository();
  const categoryUseCase = new CategoryUseCase(categoryRepository);

  server.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const params = parseParams(paramsIdSchema, request.params, reply);
    if (!params) return;

    try {
      const category = await categoryUseCase.findById(params.id);
      if (!category)
        return reply.code(404).send({ message: "Categoria não encontrada" });
      reply.send(category);
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
        const categories = await categoryUseCase.findByAccount(
          params.accountId
        );
        reply.send(categories);
      } catch {
        reply.code(500).send({ message: "Erro interno do servidor" });
      }
    }
  );

  server.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const result = categoryCreateSchema.safeParse(request.body);
    if (!result.success) {
      reply.code(400).send({
        message: "Falha de validação",
        errors: result.error.errors,
      });
      return;
    }

    try {
      const category = await categoryUseCase.create(result.data);
      reply.code(201).send(category);
    } catch (error) {
      reply.code(500).send({
        message: error instanceof Error ? error.message : "Erro inesperado",
      });
    }
  });

  server.put("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const params = parseParams(paramsIdSchema, request.params, reply);
    if (!params) return;

    const body = categoryUpdateSchema.safeParse(request.body);
    if (!body.success) {
      reply.code(400).send({
        message: "Falha de validação",
        errors: body.error.errors,
      });
      return;
    }

    try {
      const updatedCategory = await categoryUseCase.update(
        params.id,
        body.data
      );
      if (!updatedCategory)
        return reply.code(404).send({ message: "Categoria não encontrada" });
      reply.send(updatedCategory);
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
        const deleted = await categoryUseCase.delete(params.id);
        if (!deleted)
          return reply.code(404).send({ message: "Categoria não encontrada" });
        reply.code(204).send();
      } catch (error) {
        reply.code(500).send({
          message: error instanceof Error ? error.message : "Erro inesperado",
        });
      }
    }
  );
}

export default categoryRoutes;
