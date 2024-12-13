import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CurrentTaskLog } from "packages/shared/src/types";

export default async function currentTaskLogRoutes(server: FastifyInstance) {
  server.post<{
    Body: CurrentTaskLog;
    Reply: { message: string; log: CurrentTaskLog };
  }>(
    "/",
    async (
      request: FastifyRequest<{ Body: CurrentTaskLog }>,
      reply: FastifyReply
    ) => {
      try {
        const log: CurrentTaskLog = request.body;
        // log._id = log._id || uuidv4();
        log._id = "FIRST";

        // Upsert the current log for the user
        const result = await server.mongo.db
          .collection<CurrentTaskLog>("currentTaskLogs")
          .updateOne(
            { _id: log._id }, // Match by user ID
            { $set: log }, // Update fields
            { upsert: true } // Insert if it doesn't exist
          );

        reply.code(200).send({
          message: "Current log saved successfully",
          log: log,
        });
      } catch (error: any) {
        console.error("Error saving current log:", error);
        reply.code(500).send({
          message: "Failed to save current log",
          error: String(error),
        });
      }
    }
  );

  server.get("/", async (request: FastifyRequest<{}>, reply: FastifyReply) => {
    console.log("Backend: Getting current log");
    try {
      const currentLog = await server.mongo.db
        .collection<CurrentTaskLog>("currentTaskLogs")
        .findOne();

      if (!currentLog) {
        return reply.code(404).send({ message: "No current log found" });
      }

      reply.code(200).send(currentLog);
    } catch (error: any) {
      console.error("Error fetching current log:", error);
      reply.code(500).send({
        message: "Failed to fetch current log",
        error: String(error),
      });
    }
  });
}
