import type { RouteHandler } from "src/types";

export const POST: RouteHandler<{ Reply: { message: string } }> = async (
  request,
  reply
) => {
  reply.send({ message: "Thank you for booking!" });
};
