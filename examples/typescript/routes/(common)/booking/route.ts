import type { RouteHandler } from "src/types";

export const POST: RouteHandler = async (request, reply) => {
  reply.send({ message: "Thank you for booking!" });
};
