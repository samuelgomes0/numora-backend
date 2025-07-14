import { RecurringTransactionRepository } from "@/repositories";
import { paramsIdSchema } from "@/schemas";
import { accountIdSchema } from "@/schemas/common.schema";
import {
  recurringTransactionCreateSchema,
  recurringTransactionUpdateSchema,
} from "@/schemas/recurringTransaction.schema";
import { RecurringTransactionUseCase } from "@/usecases";
import { FastifyInstance } from "fastify";

async function recurringTransactionRoutes(server: FastifyInstance) {
  const usecase = new RecurringTransactionUseCase(new RecurringTransactionRepository());

  // GET /recurring-transactions/account/:accountId
  server.get("/account/:accountId", async (req, res) => {
    const parsed = accountIdSchema.safeParse(req.params);
    if (!parsed.success)
      return res
        .code(400)
        .send({ message: "Invalid parameters", errors: parsed.error.errors });

    try {
      const transactions = await usecase.findByAccount(parsed.data.accountId);
      return res.send(transactions);
    } catch {
      return res.code(500).send({ message: "Internal server error" });
    }
  });

  // POST /recurring-transactions
  server.post("/", async (req, res) => {
    try {
      const data = recurringTransactionCreateSchema.parse(req.body);
      const transaction = await usecase.create(data);
      return res.code(201).send(transaction);
    } catch (error) {
      return res.code(400).send({
        message: error instanceof Error ? error.message : "Invalid request",
      });
    }
  });

  // PUT /recurring-transactions/:id
  server.put("/:id", async (req, res) => {
    const parsed = paramsIdSchema.safeParse(req.params);
    if (!parsed.success)
      return res
        .code(400)
        .send({ message: "Invalid parameters", errors: parsed.error.errors });

    try {
      const data = recurringTransactionUpdateSchema.parse(req.body);
      const updated = await usecase.update(parsed.data.id, data);
      return res.send(updated);
    } catch (error) {
      return res.code(400).send({
        message: error instanceof Error ? error.message : "Invalid request",
      });
    }
  });

  // DELETE /recurring-transactions/:id
  server.delete("/:id", async (req, res) => {
    const parsed = paramsIdSchema.safeParse(req.params);
    if (!parsed.success)
      return res
        .code(400)
        .send({ message: "Invalid parameters", errors: parsed.error.errors });

    try {
      await usecase.delete(parsed.data.id);
      return res.code(204).send();
    } catch {
      return res.code(500).send({ message: "Internal server error" });
    }
  });
}

export default recurringTransactionRoutes;
