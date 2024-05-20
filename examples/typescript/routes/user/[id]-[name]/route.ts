import type { RouteHandler } from "src/types";

export const POST: RouteHandler<{
  Params: { id: string; name: string };
}> = async (req, res) => {
  res.send({ message: `Hello ${req.params.name} with id ${req.params.id}` });
};
