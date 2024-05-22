import path from "node:path";
import fastify, {
  type FastifyServerOptions,
  type FastifyInstance,
} from "fastify";
import dirRoutes from "../src";

export const initilize = async (
  opts?: FastifyServerOptions
): Promise<FastifyInstance> => {
  const app: FastifyInstance = fastify(opts);

  await app.register(dirRoutes, {
    routesDir: path.resolve(__dirname, "..", "examples/typescript/routes"),
    prefix: "/api",
  });

  return app;
};
