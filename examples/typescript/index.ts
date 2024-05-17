import fastify, { type FastifyInstance } from "fastify";
import dirRoutes from "../../src";

const main = async (): Promise<void> => {
  const app: FastifyInstance = fastify({ logger: { level: "debug" } });

  await app.register(dirRoutes, {
    routesDir: "./routes",
    prefix: "/api",
  });

  app.printRoutes();
  await app.listen({ port: 3000 });
};
main().catch((error) => {
  // eslint-disable-next-line no-console
  console.log(error);
});
