import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TaskLog } from "packages/shared/src/types";
import { v4 as uuidv4 } from "uuid";

export default async function taskLogRoutes(server: FastifyInstance) {
  // Get the tasks
  server.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
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
      try {
        const { type, subtype, dateStart, dateEnd, notes } = request.body;

        const log = {
          _id: uuidv4(),
          type: type,
          subtype: subtype,
          dateStart: new Date(dateStart), // Parse inline
          dateEnd: new Date(dateEnd),
          notes: notes,
        };

        const result = await server.mongo.db
          .collection<TaskLog>("taskLogs")
          .insertOne(log);

        const logInserted: TaskLog = { ...log, _id: result.insertedId };
        reply.code(201).send({
          message: "Task logged successfully",
          log: logInserted,
        });
      } catch (error: any) {
        console.error("Error logging task:", error);
        reply.code(500).send({
          message: "Failed to log task",
          error: String(error),
        });
      }
    }
  );

  server.delete(
    "/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const id = request.params.id;
        const result = await server.mongo.db
          .collection<TaskLog>("taskLogs")
          .deleteOne({ _id: id });

        if (result.deletedCount === 1) {
          reply.code(200).send({ message: "Task log deleted successfully" });
        } else {
          reply.code(404).send({ message: "Task log not found" });
        }
      } catch (error: any) {
        console.error("Error deleting task log:", error);
        reply.code(500).send({
          message: "Failed to delete task log",
          error: String(error),
        });
      }
    }
  );
}
