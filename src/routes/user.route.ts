import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { UserRepository } from "../repositories";
import { createUserSchema } from "../schemas";
import { UserUseCase } from "../usecases";

// Schemas extraídos para fora das rotas
const paramsIdSchema = z.object({
  id: z.string().uuid(),
});

const paramsEmailSchema = z.object({
  email: z.string().email(),
});

async function userRoutes(server: FastifyInstance) {
  const userRepository = new UserRepository();
  const userUseCase = new UserUseCase(userRepository);

  // Rotas mais específicas primeiro
  server.get(
    "/email/:email",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parseResult = paramsEmailSchema.safeParse(request.params);
      if (!parseResult.success) {
        return reply.code(400).send({
          message: "Invalid email",
          errors: parseResult.error.errors,
        });
      }

      const { email } = parseResult.data;
      try {
        const user = await userUseCase.findByEmail(email);
        if (!user) {
          return reply.code(404).send({ message: "User not found" });
        }
        return reply.send(user);
      } catch (error) {
        return reply.code(500).send({
          message: error instanceof Error ? error.message : "Unexpected error",
        });
      }
    }
  );

  server.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = paramsIdSchema.safeParse(request.params);
    if (!parseResult.success) {
      return reply.code(400).send({
        message: "Invalid user ID",
        errors: parseResult.error.errors,
      });
    }

    const { id } = parseResult.data;
    try {
      const user = await userUseCase.findById(id);
      if (!user) {
        return reply.code(404).send({ message: "User not found" });
      }
      return reply.send(user);
    } catch (error) {
      return reply.code(500).send({
        message: error instanceof Error ? error.message : "Unexpected error",
      });
    }
  });

  server.get("/", async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const users = await userUseCase.findAll();
      return reply.send(users);
    } catch (error) {
      return reply.code(500).send({
        message: error instanceof Error ? error.message : "Unexpected error",
      });
    }
  });

  server.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = createUserSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.code(400).send({
        message: "Validation failed",
        errors: parseResult.error.errors,
      });
    }

    const { name, email, password } = parseResult.data;
    try {
      const user = await userUseCase.create({ name, email, password });
      return reply.code(201).send(user);
    } catch (error) {
      return reply.code(500).send({
        message: error instanceof Error ? error.message : "Unexpected error",
      });
    }
  });

  server.delete("/", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parseResult = paramsIdSchema.safeParse(request.body);

      if (!parseResult.success) {
        return reply.code(400).send({
          message: "Validation failed",
          errors: parseResult.error.errors,
        });
      }

      const { id } = parseResult.data;

      await userUseCase.delete(id);

      return reply.code(200).send(true);
    } catch (error) {
      return reply.code(500).send({
        message: error instanceof Error ? error.message : "Unexpected error",
      });
    }
  });
}

export default userRoutes;
