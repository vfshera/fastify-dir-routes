import type {
  ContextConfigDefault,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
  RouteShorthandOptions,
} from "fastify";

import type { RouteGenericInterface } from "fastify/types/route";

type DirRouteHandlerMethod<
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  ContextConfig = ContextConfigDefault
> = (
  this: FastifyInstance<RawServer, RawRequest, RawReply>,
  request: FastifyRequest<RouteGeneric, RawServer, RawRequest>,
  reply: FastifyReply<
    RawServer,
    RawRequest,
    RawReply,
    RouteGeneric,
    ContextConfig
  >,
  server: FastifyInstance<RawServer, RawRequest, RawReply>
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
) => void | RouteGeneric["Reply"] | Promise<RouteGeneric["Reply"] | void>;

export interface RouteHandler<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  ContextConfig = ContextConfigDefault,
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>
> extends DirRouteHandlerMethod<
    RawServer,
    RawRequest,
    RawReply,
    RouteGeneric,
    ContextConfig
  > {
  opts?: RouteShorthandOptions<
    RawServer,
    RawRequest,
    RawReply,
    RouteGeneric,
    ContextConfig
  >;
}

export type DirRoutesPluginOptions = {
  routesDir: string;
  prefix?: string;
};
