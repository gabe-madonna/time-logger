import Fastify from "fastify";
import dotenv from "dotenv";
import mongoPlugin from "./plugins/mongodb";
import taskLogRoutes from "./routes/taskLogs";
import taskOptionRoutes from "./routes/taskOptions";
import fastifyCors from "@fastify/cors";

dotenv.config();

const startServer = async () => {
  const fastify = Fastify({ logger: true });

  // Register MongoDB plugin
  fastify.register(mongoPlugin);

  // Register routes
  fastify.register(taskLogRoutes, { prefix: "/logs" });
  fastify.register(taskOptionRoutes, { prefix: "/options" });

  //CORS
  fastify.register(fastifyCors, {
    origin: (origin, callback) => {
      console.log("CORS origin:", origin); // Log the origin for debugging
      const allowedOrigins = [
        "https://time-logger-mu.vercel.app",
        "https://time-logger-jusim95ir-gabes-projects-75d3b6da.vercel.app",
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
