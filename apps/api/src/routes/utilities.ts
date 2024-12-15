import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function utilitiesRoutes(server: FastifyInstance) {
  server.get(
    "/heartbeat",
    async (request: FastifyRequest, reply: FastifyReply) => {
      reply.code(200).send({
        message: "bump-bump",
      });
    }
  );
}
