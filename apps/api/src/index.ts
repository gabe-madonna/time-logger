import Fastify from "fastify";
import dotenv from "dotenv";
import mongoPlugin from "./plugins/mongodb";
import taskRoutes from "./routes/taskLogs";
import { TaskLog } from "packages/shared/src/types";
import fastifyCors from "@fastify/cors";

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

  //CORS
  fastify.register(fastifyCors, {
    origin: (origin, callback) => {
      console.log("CORS origin:", origin); // Log the origin for debugging
      const allowedOrigins = [
        "http://localhost:5175", // Local frontend for development
        "https://time-logger-jusim95ir-gabes-projects-75d3b6da.vercel.app", // Your Vercel frontend URL
      ];

      // Allow any localhost origin
      const isLocalhost = origin?.startsWith("http://localhost");

      if (!origin || isLocalhost || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS"), false); // Deny the request
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow necessary HTTP methods
  });

  fastify.options("*", (request, reply) => {
    reply
      .header("Access-Control-Allow-Origin", request.headers.origin || "")
      .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
      .header("Access-Control-Allow-Headers", "Content-Type, Authorization")
      .send();
  });

  // call a task logging endpoint to test it

  const PORT = parseInt(process.env.TIME_LOGGER_PORT || "3000", 10);
  const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

  try {
    await fastify.listen({ port: PORT, host: HOST });
    fastify.log.info(`Server running on ${HOST}:${PORT}`);
    // const log: TaskLog = {
    //   task: "coding",
    //   type: "chore",
    //   dateStart: new Date(),
    //   dateEnd: new Date(),
    // };
    // const response1 = await fastify.inject({
    //   method: "POST",
    //   url: "/logs/",
    //   body: log,
    // });
    // console.log("abc:", response1.json());

    // const response2 = await fastify.inject({
    //   method: "GET",
    //   url: "/logs/",
    // });
    // console.log("123:", response2.json());
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
