import Fastify from "fastify";
import taskRoutes from "./routes/task";

const server = Fastify({ logger: true });
server.register(taskRoutes);

// Define a basic route
server.get("/ping", async (request, reply) => {
  return { message: "pong" };
});

// Start the server
const start = async () => {
  try {
    const address = await server.listen({ port: 0, host: "0.0.0.0" });
    console.log(`Server is running at ${address}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
