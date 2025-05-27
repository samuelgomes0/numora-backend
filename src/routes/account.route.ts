import { FastifyInstance } from "fastify";
import z from "zod";
import { AccountRepository } from "../repositories";
import { accountCreateSchema } from "../schemas";
import { AccountUseCase } from "../usecases";

function accountRoutes(server: FastifyInstance) {
  const accountRepository = new AccountRepository();
  const accountUseCase = new AccountUseCase(accountRepository);

  server.get("/", () => {
    return accountUseCase.findAll();
  });

  server.post("/", async (request, reply) => {
    try {
      const { userId, name } = accountCreateSchema.parse(request.body);

      console.log(userId, name);

      const account = await accountUseCase.create({ userId, name });

      return reply.code(201).send(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          message: "Validation failed",
          errors: error.errors,
        });
      }
    }
  });

  server.delete("/:id", async (request, reply) => {
    try {
      const { id } = z.object({ id: z.string() }).parse(request.params);

      await accountUseCase.delete(id);

      return reply.code(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          message: "Validation failed",
          errors: error.errors,
        });
      }
      return reply.code(500).send({
        message: "Internal server error",
      });
    }
  });
}

export default accountRoutes;
