import { CategoryRepository } from "@/repositories";
import { paramsIdSchema } from "@/schemas";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
} from "@/schemas/category.schema";
import { CategoryUseCase } from "@/usecases";

import { FastifyInstance } from "fastify";
import z from "zod";

async function categoryRoutes(server: FastifyInstance) {
  const categoryRepository = new CategoryRepository();
  const categoryUseCase = new CategoryUseCase(categoryRepository);

  // GET /categories
  server.get("/", async (_, reply) => {
    try {
      const categories = await categoryUseCase.findAll();
      return reply.send(categories);
    } catch {
      return reply.code(500).send({ message: "Internal server error" });
    }
  });

  // GET /categories/:id
  server.get("/:id", async (request, reply) => {
    const result = paramsIdSchema.safeParse(request.params);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid category ID",
        errors: result.error.errors,
      });
    }

    try {
      const category = await categoryUseCase.findById(result.data.id);
      if (!category) {
        return reply.code(404).send({ message: "Category not found" });
      }
      return reply.send(category);
    } catch {
      return reply.code(500).send({ message: "Internal server error" });
    }
  });

  // POST /categories
  server.post("/", async (request, reply) => {
    try {
      const data = categoryCreateSchema.parse(request.body);
      const category = await categoryUseCase.create(data);
      return reply.code(201).send(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          message: "Invalid request payload",
          errors: error.errors,
        });
      }
      return reply.code(500).send({ message: "Internal server error" });
    }
  });

  // PUT /categories/:id
  server.put("/:id", async (request, reply) => {
    const result = paramsIdSchema.safeParse(request.params);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid category ID",
        errors: result.error.errors,
      });
    }

    try {
      const data = categoryUpdateSchema.parse(request.body);
      const updatedCategory = await categoryUseCase.update(
        result.data.id,
        data
      );
      if (!updatedCategory) {
        return reply.code(404).send({ message: "Category not found" });
      }
      return reply.send(updatedCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          message: "Invalid request payload",
          errors: error.errors,
        });
      }
      return reply.code(500).send({ message: "Internal server error" });
    }
  });

  // DELETE /categories/:id
  server.delete("/:id", async (request, reply) => {
    const result = paramsIdSchema.safeParse(request.params);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid category ID",
        errors: result.error.errors,
      });
    }

    try {
      const deleted = await categoryUseCase.delete(result.data.id);
      if (!deleted) {
        return reply.code(404).send({ message: "Category not found" });
      }
      return reply.code(204).send();
    } catch {
      return reply.code(500).send({ message: "Internal server error" });
    }
  });
}

export default categoryRoutes;
