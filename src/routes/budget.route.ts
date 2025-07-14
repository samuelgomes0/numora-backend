import { BudgetRepository } from "@/repositories";
import { paramsIdSchema } from "@/schemas";
import { budgetCreateSchema, budgetUpdateSchema } from "@/schemas/budget.schema";
import { userIdSchema } from "@/schemas/common.schema";
import { BudgetUseCase } from "@/usecases";
import { FastifyInstance } from "fastify";

async function budgetRoutes(server: FastifyInstance) {
  const budgetUseCase = new BudgetUseCase(new BudgetRepository());

  server.get("/user/:userId", async (req, res) => {
    const parsed = userIdSchema.safeParse(req.params);
    if (!parsed.success)
      return res
        .code(400)
        .send({ message: "Invalid parameters", errors: parsed.error.errors });

    try {
      const budgets = await budgetUseCase.findByUser(parsed.data.userId);
      return res.send(budgets);
    } catch {
      return res.code(500).send({ message: "Internal server error" });
    }
  });

  server.post("/", async (req, res) => {
    try {
      const data = budgetCreateSchema.parse(req.body);
      const budget = await budgetUseCase.create(data);
      return res.code(201).send(budget);
    } catch (error) {
      return res.code(400).send({
        message: error instanceof Error ? error.message : "Invalid request",
      });
    }
  });

  server.put("/:id", async (req, res) => {
    const parsed = paramsIdSchema.safeParse(req.params);
    if (!parsed.success)
      return res
        .code(400)
        .send({ message: "Invalid parameters", errors: parsed.error.errors });

    try {
      const data = budgetUpdateSchema.parse(req.body);
      const updated = await budgetUseCase.update(parsed.data.id, data);
      return res.send(updated);
    } catch (error) {
      return res.code(400).send({
        message: error instanceof Error ? error.message : "Invalid request",
      });
    }
  });

  server.delete("/:id", async (req, res) => {
    const parsed = paramsIdSchema.safeParse(req.params);
    if (!parsed.success)
      return res
        .code(400)
        .send({ message: "Invalid parameters", errors: parsed.error.errors });

    try {
      await budgetUseCase.delete(parsed.data.id);
      return res.code(204).send();
    } catch {
      return res.code(500).send({ message: "Internal server error" });
    }
  });
}

export default budgetRoutes;
