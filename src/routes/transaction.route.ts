import { FastifyInstance } from "fastify";
import { TransactionRepository } from "../repositories";
import { transactionCreateSchema } from "../schemas";
import { TransactionUseCase } from "../usecases/";

async function transactionRoutes(server: FastifyInstance) {
  const transactionRepository = new TransactionRepository();
  const transactionUseCase = new TransactionUseCase(transactionRepository);

  server.get("/", async (request, reply) => {
    console.log(new Date());

    return transactionUseCase.findAll();
  });

  server.post("/", async (request, reply) => {
    const { description, amount, date, transactionType, accountId } =
      transactionCreateSchema.parse(request.body);

    const transaction = transactionUseCase.create({
      description,
      amount,
      date: new Date(date),
      transactionType,
      accountId,
    });

    return reply.status(201).send(transaction);
  });

  server.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await transactionUseCase.delete(id);
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === "Transaction not found") {
        return reply.status(404).send({ error: "Transaction not found" });
      }
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}

export default transactionRoutes;
