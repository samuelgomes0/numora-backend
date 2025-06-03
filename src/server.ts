import fastify from "fastify";

import routes from "./routes";

const server = fastify();

server.get("/", async (_, reply) => {
  reply.send({ hello: "world" });
});

server.register(routes, { prefix: "/api" });

export default server;
