import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TaskOption } from "packages/shared/src/types";

export default async function taskOptionRoutes(server: FastifyInstance) {
  server.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    server.log.info("Getting all task options");
    const options: TaskOption[] = await server.mongo.db
      .collection<TaskOption>("taskOptions")
      .find()
      .toArray();
    // TODO sort task types by frequency in task logs and sort subtypes by frequency in task logs for that type
    reply.code(200).send(options);
  });
}
