import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TaskLog } from "packages/shared/src/types";

export default async function taskRoutes(server: FastifyInstance) {
  // Get the tasks
  server.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    server.log.info("Getting all tasks");
    const tasks = await server.mongo.db
      .collection<TaskLog>("taskLogs")
      .find({ sort: { dateStart: 1 } })
      .toArray();
    reply.code(200).send(tasks);
  });

  // Logs a new task
  server.post(
    "/",
    async (request: FastifyRequest<{ Body: TaskLog }>, reply: FastifyReply) => {
      const taskLog = request.body;

      const result = await server.mongo.db
        .collection<TaskLog>("taskLogs")
        .insertOne(taskLog);

      reply.code(201).send({
        message: "Task logged successfully",
        insertedId: result.insertedId,
      });
    }
  );
}
