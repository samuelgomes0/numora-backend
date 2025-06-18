import { UserRepository } from "@/repositories";
import { createUserSchema, paramsEmailSchema, paramsIdSchema, updateUserSchema } from "@/schemas";
import { UserUseCase } from "@/usecases";
import { FastifyInstance } from "fastify";
import z from "zod";

async function userRoutes(server: FastifyInstance) {
  const userRepository = new UserRepository();
  const userUseCase = new UserUseCase(userRepository);

  const parseParams = <T>(schema: z.ZodSchema<T>, params: unknown, reply: any): T | null => {
    const result = schema.safeParse(params);
    if (!result.success) {
      reply.status(400).send({ message: "Invalid parameters", errors: result.error.errors });
      return null;
    }
    return result.data;
  };

  server.get("/", async (_, reply) => {
    try {
      const users = await userUseCase.findAll();
      reply.send(users);
    } catch {
      reply.status(500).send({ message: "Internal server error" });
    }
  });

  server.get("/:id", async (request, reply) => {
    const data = parseParams(paramsIdSchema, request.params, reply);
    if (!data) return;

    try {
      const user = await userUseCase.findById(data.id);
      if (!user) return reply.status(404).send({ message: "User not found" });
      reply.send(user);
    } catch {
      reply.status(500).send({ message: "Internal server error" });
    }
  });

  server.get("/email/:email", async (request, reply) => {
    const data = parseParams(paramsEmailSchema, request.params, reply);
    if (!data) return;

    try {
      const user = await userUseCase.findByEmail(data.email);
      if (!user) return reply.status(404).send({ message: "User not found" });
      reply.send(user);
    } catch {
      reply.status(500).send({ message: "Internal server error" });
    }
  });

  server.post("/", async (request, reply) => {
    const result = createUserSchema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send({
        message: "Validation failed",
        errors: result.error.errors,
      });
    }

    try {
      const user = await userUseCase.create(result.data);
      reply.status(201).send(user);
    } catch (error) {
      reply.status(500).send({
        message: error instanceof Error ? error.message : "Unexpected error",
      });
    }
  });

  server.put("/:id", async (request, reply) => {
    const params = parseParams(paramsIdSchema, request.params, reply);
    if (!params) return;

    const body = updateUserSchema.safeParse(request.body);
    if (!body.success) {
      return reply.status(400).send({
        message: "Validation failed",
        errors: body.error.errors,
      });
    }

    try {
      const updatedUser = await userUseCase.update(params.id, body.data);
      reply.send(updatedUser);
    } catch (error) {
      reply.status(500).send({
        message: error instanceof Error ? error.message : "Unexpected error",
      });
    }
  });

  server.delete("/:id", async (request, reply) => {
    const params = parseParams(paramsIdSchema, request.params, reply);
    if (!params) return;

    try {
      const deleted = await userUseCase.delete(params.id);
      if (!deleted) return reply.status(404).send({ message: "User not found" });
      reply.status(204).send();
    } catch (error) {
      reply.status(500).send({
        message: error instanceof Error ? error.message : "Unexpected error",
      });
    }
  });
}

export default userRoutes;
