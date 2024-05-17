import type { RouteHandler } from "src/types";

export const GET: RouteHandler = async (req, res) => {
  return res.send({ message: "Hello" });
};
