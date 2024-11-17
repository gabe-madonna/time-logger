import { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { MongoClient, Db } from "mongodb";

declare module "fastify" {
  interface FastifyInstance {
    mongo: {
      client: MongoClient;
      db: Db;
    };
  }
}

const mongoPlugin = fastifyPlugin(async (fastify: FastifyInstance) => {
  const uri = process.env.TIME_LOGGER_MONGO_KEY!;

  const client = new MongoClient(uri);
  await client.connect();

  fastify.decorate("mongo", { client, db: client.db("main") });

  fastify.addHook("onClose", async (done) => {
    await client.close();
  });
});

export default mongoPlugin;
