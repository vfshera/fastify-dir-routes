import type { RouteHandler } from "src/types";

export const POST: RouteHandler = async (req, res) => {
  res.send({ message: "Hello" });
};
