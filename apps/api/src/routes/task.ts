import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { TaskLog } from "packages/shared/src/types";

export default async function taskRoutes(server: FastifyInstance) {
  const log: TaskLog = {
    task: "coding",
    type: "work",
    dateStart: new Date(),
    dateEnd: new Date(),
  };
  // POST /tasks - Logs a new task
  server.post(
    "/tasks",
    async (request: FastifyRequest<{ Body: TaskLog }>, reply: FastifyReply) => {
      const task = request.body;

      // Here, you might save the task to a database
      // For simplicity, let's log the task to the console
      console.log("Task logged:", task);

      reply.code(201).send({ message: "Task logged successfully", task });
    }
  );
}
