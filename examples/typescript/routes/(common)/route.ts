import type { RouteHandler } from "src/types";

//  this route is hanging without a directory hence will not be matched
export const DELETE: RouteHandler = async () => {};
