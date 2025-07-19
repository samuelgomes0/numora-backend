import { UserRepository } from "@/repositories";
import {
  createUserSchema,
  paramsEmailSchema,
  paramsIdSchema,
  updateUserSchema,
} from "@/schemas";
import { UserUseCase } from "@/usecases";
import { parseParams } from "@/utils";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

async function userRoutes(server: FastifyInstance) {
  const userRepository = new UserRepository();
  const userUseCase = new UserUseCase(userRepository);

  server.get("/", async (_: FastifyRequest, reply: FastifyReply) => {
    try {
      const users = await userUseCase.findAll();
      reply.send(users);
    } catch {
      reply.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  server.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const params = parseParams(paramsIdSchema, request.params, reply);
    if (!params) return;

    try {
      const user = await userUseCase.findById(params.id);
      if (!user)
        return reply.code(404).send({ message: "Usuário não encontrado" });
      reply.send(user);
    } catch {
      reply.code(500).send({ message: "Erro interno do servidor" });
    }
  });

  server.get(
    "/email/:email",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = parseParams(paramsEmailSchema, request.params, reply);
      if (!params) return;

      try {
        const user = await userUseCase.findByEmail(params.email);
        if (!user)
          return reply.code(404).send({ message: "Usuário não encontrado" });
        reply.send(user);
      } catch {
        reply.code(500).send({ message: "Erro interno do servidor" });
      }
    }
  );

  server.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const result = createUserSchema.safeParse(request.body);
    if (!result.success) {
      reply.code(400).send({
        message: "Falha de validação",
        errors: result.error,
      });
      return;
    }

    try {
      const user = await userUseCase.create(result.data);
      reply.code(201).send(user);
    } catch (error) {
      reply.code(500).send({
        message: error instanceof Error ? error.message : "Erro inesperado",
      });
    }
  });

  server.put("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const params = parseParams(paramsIdSchema, request.params, reply);
    if (!params) return;

    const body = updateUserSchema.safeParse(request.body);
    if (!body.success) {
      reply.code(400).send({
        message: "Falha de validação",
        errors: body.error,
      });
      return;
    }

    try {
      const updatedUser = await userUseCase.update(params.id, body.data);
      reply.send(updatedUser);
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
        const deleted = await userUseCase.delete(params.id);
        if (!deleted)
          return reply.code(404).send({ message: "Usuário não encontrado" });
        reply.code(204).send();
      } catch (error) {
        reply.code(500).send({
          message: error instanceof Error ? error.message : "Erro inesperado",
        });
      }
    }
  );
}

export default userRoutes;
