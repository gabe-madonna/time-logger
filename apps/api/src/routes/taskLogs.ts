import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TaskLog } from "packages/shared/src/types";

export default async function taskLogRoutes(server: FastifyInstance) {
  // Get the tasks
  server.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    server.log.info("Getting all task logs");
    const logs: TaskLog[] = await server.mongo.db
      .collection<TaskLog>("taskLogs")
      .find()
      .sort({ dateStart: -1 })
      .toArray();
    reply.code(200).send(logs);
  });

  // Logs a new task
  server.post(
    "/",
    async (request: FastifyRequest<{ Body: TaskLog }>, reply: FastifyReply) => {
      const { type, subtype, dateStart, dateEnd, notes } = request.body;

      const log = {
        type,
        subtype,
        dateStart: new Date(dateStart), // Parse inline
        dateEnd: new Date(dateEnd),
        notes: notes,
      };

      const result = await server.mongo.db
        .collection<TaskLog>("taskLogs")
        .insertOne(log);

      reply.code(201).send({
        message: "Task logged successfully",
        insertedId: result.insertedId,
      });
    }
  );
}
