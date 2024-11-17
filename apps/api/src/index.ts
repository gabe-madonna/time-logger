import Fastify from "fastify";
import dotenv from "dotenv";
import mongoPlugin from "./plugins/mongodb";
import userRoutes from "./routes/taskLogs";

dotenv.config();

const startServer = async () => {
  const fastify = Fastify({ logger: true });

  // Register MongoDB plugin
  fastify.register(mongoPlugin);

  // Register routes
  fastify.register(userRoutes, { prefix: "/users" });

  const PORT = parseInt(process.env.TIME_LOGGER_PORT || "3000", 10);

  try {
    await fastify.listen({ port: PORT });
    fastify.log.info(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
