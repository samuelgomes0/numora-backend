import { FastifyInstance } from "fastify";

import accountRoutes from "./account.route";
import categoryRoutes from "./category.route";
import transactionRoutes from "./transaction.route";
import userRoutes from "./user.route";

async function routes(server: FastifyInstance) {
  server.register(accountRoutes, { prefix: "/accounts" });
  server.register(categoryRoutes, { prefix: "/categories" });
  server.register(transactionRoutes, { prefix: "/transactions" });
  server.register(userRoutes, { prefix: "/users" });
}

export default routes;
