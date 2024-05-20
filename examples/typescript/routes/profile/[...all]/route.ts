import type { RouteHandler } from "../../../../../src/types";

export const GET: RouteHandler<{
  Params: { all: string };
  Reply: { message: string };
}> = async (req, res) => {
  return res.send({ message: `Catched all: '${req.params.all}'` });
};
