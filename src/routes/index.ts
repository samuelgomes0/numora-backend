import { FastifyInstance } from "fastify";
import accountRoutes from "./account.route";
import budgetRoutes from "./budget.route";
import categoryRoutes from "./category.route";
import goalRoutes from "./goal.route";
import recurringTransactionRoutes from "./recurringTransaction.route";
import transactionRoutes from "./transaction.route";
import userRoutes from "./user.route";

async function routes(server: FastifyInstance) {
  server.register(accountRoutes, { prefix: "/accounts" });
  server.register(budgetRoutes, { prefix: "/budget" });
  server.register(categoryRoutes, { prefix: "/categories" });
  server.register(goalRoutes, { prefix: "/goals" });
  server.register(recurringTransactionRoutes, {
    prefix: "/recurringTransaction",
  });
  server.register(transactionRoutes, { prefix: "/transactions" });
  server.register(userRoutes, { prefix: "/users" });
}

export default routes;
