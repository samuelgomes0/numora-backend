import { CategoryRepository } from "@/repositories";
import { categoryCreateSchema, categoryUpdateSchema, paramsIdSchema } from "@/schemas";
import { CategoryUseCase } from "@/usecases";
import { FastifyInstance } from "fastify";
import z from "zod";

async function categoryRoutes(server: FastifyInstance) {
  const categoryRepository = new CategoryRepository();
  const categoryUseCase = new CategoryUseCase(categoryRepository);

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

  server.get("/", async (_, reply) => {
    try {
      const categories = await categoryUseCase.findAll();
      reply.send(categories);
    } catch {
      reply.code(500).send({ message: "Internal server error" });
    }
  });

  server.get("/:id", async (request, reply) => {
    const data = parseParams(paramsIdSchema, request.params, reply);
    if (!data) return;

    try {
      const category = await categoryUseCase.findById(data.id);
      if (!category) return reply.code(404).send({ message: "Category not found" });
      reply.send(category);
    } catch {
      reply.code(500).send({ message: "Internal server error" });
    }
  });

  server.post("/", async (request, reply) => {
    try {
      const data = categoryCreateSchema.parse(request.body);
      const category = await categoryUseCase.create(data);
      reply.code(201).send(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          message: "Invalid request payload",
          errors: error.errors,
        });
      }
      reply.code(500).send({ message: "Internal server error" });
    }
  });

  server.put("/:id", async (request, reply) => {
    const data = parseParams(paramsIdSchema, request.params, reply);
    if (!data) return;

    try {
      const body = categoryUpdateSchema.parse(request.body);
      const updated = await categoryUseCase.update(data.id, body);
      if (!updated) return reply.code(404).send({ message: "Category not found" });
      reply.send(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          message: "Invalid request payload",
          errors: error.errors,
        });
      }
      reply.code(500).send({ message: "Internal server error" });
    }
  });

  server.delete("/:id", async (request, reply) => {
    const data = parseParams(paramsIdSchema, request.params, reply);
    if (!data) return;

    try {
      const deleted = await categoryUseCase.delete(data.id);
      if (!deleted) return reply.code(404).send({ message: "Category not found" });
      reply.code(204).send();
    } catch {
      reply.code(500).send({ message: "Internal server error" });
    }
  });
}

export default categoryRoutes;
