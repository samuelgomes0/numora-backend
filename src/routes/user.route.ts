import { UserRepository } from "@/repositories";
import { createUserSchema, updateUserSchema } from "@/schemas";
import { UserUseCase } from "@/usecases";

import { FastifyInstance } from "fastify";
import z from "zod";

const paramsIdSchema = z.object({ id: z.string().uuid() });
const paramsEmailSchema = z.object({ email: z.string().email() });

async function userRoutes(server: FastifyInstance) {
  const userRepository = new UserRepository();
  const userUseCase = new UserUseCase(userRepository);

  server.get("/", async (_, reply) => {
    try {
      const users = await userUseCase.findAll();
      return reply.send(users);
    } catch {
      return reply.code(500).send({ message: "Internal server error" });
    }
  });

  server.get("/:id", async (request, reply) => {
    const result = paramsIdSchema.safeParse(request.params);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid user ID",
        errors: result.error.errors,
      });
    }
    try {
      const user = await userUseCase.findById(result.data.id);
      if (!user) return reply.code(404).send({ message: "User not found" });
      return reply.send(user);
    } catch {
      return reply.code(500).send({ message: "Internal server error" });
    }
  });

  server.get("/email/:email", async (request, reply) => {
    const result = paramsEmailSchema.safeParse(request.params);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid email",
        errors: result.error.errors,
      });
    }
    try {
      const user = await userUseCase.findByEmail(result.data.email);
      if (!user) return reply.code(404).send({ message: "User not found" });
      return reply.send(user);
    } catch {
      return reply.code(500).send({ message: "Internal server error" });
    }
  });

  server.post("/", async (request, reply) => {
    const result = createUserSchema.safeParse(request.body);
    if (!result.success) {
      return reply.code(400).send({
        message: "Validation failed",
        errors: result.error.errors,
      });
    }
    try {
      const user = await userUseCase.create(result.data);
      return reply.code(201).send(user);
    } catch (error) {
      return reply.code(500).send({
        message: error instanceof Error ? error.message : "Unexpected error",
      });
    }
  });

  server.put("/:id", async (request, reply) => {
    const idResult = paramsIdSchema.safeParse(request.params);
    if (!idResult.success) {
      return reply.code(400).send({
        message: "Invalid user ID",
        errors: idResult.error.errors,
      });
    }
    const bodyResult = updateUserSchema.safeParse(request.body);
    if (!bodyResult.success) {
      return reply.code(400).send({
        message: "Validation failed",
        errors: bodyResult.error.errors,
      });
    }
    try {
      const updatedUser = await userUseCase.update(
        idResult.data.id,
        bodyResult.data
      );
      return reply.send(updatedUser);
    } catch (error) {
      return reply.code(500).send({
        message: error instanceof Error ? error.message : "Unexpected error",
      });
    }
  });

  server.delete("/:id", async (request, reply) => {
    const result = paramsIdSchema.safeParse(request.params);
    if (!result.success) {
      return reply.code(400).send({
        message: "Invalid user ID",
        errors: result.error.errors,
      });
    }
    try {
      const deleted = await userUseCase.delete(result.data.id);
      if (!deleted) return reply.code(404).send({ message: "User not found" });
      return reply.code(204).send();
    } catch (error) {
      return reply.code(500).send({
        message: error instanceof Error ? error.message : "Unexpected error",
      });
    }
  });
}

export default userRoutes;
