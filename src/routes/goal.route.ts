import { GoalRepository } from "@/repositories";
import { paramsIdSchema } from "@/schemas";
import { userIdSchema } from "@/schemas/common.schema";
import { goalCreateSchema, goalUpdateSchema } from "@/schemas/goal.schema";
import { GoalUseCase } from "@/usecases";
import { FastifyInstance } from "fastify";

async function goalRoutes(server: FastifyInstance) {
  const goalUseCase = new GoalUseCase(new GoalRepository());

  server.get("/user/:userId", async (req, res) => {
    const parsed = userIdSchema.safeParse(req.params);
    if (!parsed.success) return res.code(400).send(parsed.error);

    try {
      const goals = await goalUseCase.findByUser(parsed.data.userId);
      return res.send(goals);
    } catch {
      return res.code(500).send({ message: "Internal server error" });
    }
  });

  server.post("/", async (req, res) => {
    try {
      const data = goalCreateSchema.parse(req.body);
      const goal = await goalUseCase.create(data);
      return res.code(201).send(goal);
    } catch (error) {
      return res.code(400).send(error);
    }
  });

  server.put("/:id", async (req, res) => {
    const parsed = paramsIdSchema.safeParse(req.params);
    if (!parsed.success) return res.code(400).send(parsed.error);

    try {
      const data = goalUpdateSchema.parse(req.body);
      const goal = await goalUseCase.update(parsed.data.id, data);
      return res.send(goal);
    } catch (error) {
      return res.code(400).send(error);
    }
  });

  server.delete("/:id", async (req, res) => {
    const parsed = paramsIdSchema.safeParse(req.params);
    if (!parsed.success) return res.code(400).send(parsed.error);

    try {
      await goalUseCase.delete(parsed.data.id);
      return res.code(204).send();
    } catch {
      return res.code(500).send({ message: "Internal server error" });
    }
  });
}

export default goalRoutes;
