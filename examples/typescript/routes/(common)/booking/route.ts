import type { RouteHandler } from "src/types";

export const POST: RouteHandler<{
  Body: { name: string };
  Reply: { message: string };
}> = async (request, reply) => {
  reply.send({ message: `Thank you for booking ${request.body.name}!` });
};

POST.opts = {
  schema: {
    body: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
      },
      required: ["name"],
    },
  },
};
