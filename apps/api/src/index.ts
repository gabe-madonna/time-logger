import Fastify from "fastify";
import dotenv from "dotenv";
import mongoPlugin from "./plugins/mongodb";
import taskRoutes from "./routes/taskLogs";
import { TaskLog } from "packages/shared/src/types";

dotenv.config();

const startServer = async () => {
  const fastify = Fastify({ logger: true });

  // ensure it releases the port when killed
  // process.on("SIGINT", async () => {
  //   console.log("Shutting down server...");
  //   await fastify.close(); // Gracefully close the server
  //   process.exit(0); // Exit the process
  // });

  // Register MongoDB plugin
  fastify.register(mongoPlugin);

  // Register routes
  fastify.register(taskRoutes, { prefix: "/logs" });

  // call a task logging endpoint to test it

  const PORT = parseInt(process.env.TIME_LOGGER_PORT || "3000", 10);

  try {
    await fastify.listen({ port: PORT });
    fastify.log.info(`Server running on http://localhost:${PORT}`);
    const log: TaskLog = {
      task: "coding",
      type: "chore",
      dateStart: new Date(),
      dateEnd: new Date(),
    };
    const response1 = await fastify.inject({
      method: "POST",
      url: "/logs/",
      body: log,
    });
    console.log("abc:", response1.json());

    const response2 = await fastify.inject({
      method: "GET",
      url: "/logs/",
    });
    console.log("123:", response2.json());
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
