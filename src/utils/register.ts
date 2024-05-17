import fs from "node:fs";
import path from "node:path";
import type { FastifyInstance, HTTPMethods, RouteHandlerMethod } from "fastify";
import { pathToUrl } from "./transformers";

import {
  ALLOWED_EXTENSIONS,
  ALLOWED_ROUTE_FILE,
  HANGING_ROUTE,
} from "../consts";

import type { RouteHandler } from "../types";

const methods: HTTPMethods[] = [
  "DELETE",
  "GET",
  "HEAD",
  "PATCH",
  "POST",
  "PUT",
  "OPTIONS",
];

const isHangingRoute = (path: string) => {
  return ALLOWED_EXTENSIONS.map((ext) =>
    path.endsWith(`${HANGING_ROUTE}${ext}`)
  ).some((isHanging) => isHanging);
};

function addRequestHandler(
  module: Record<HTTPMethods, unknown>,
  method: HTTPMethods,
  server: FastifyInstance,
  fileRouteServerPath: string
) {
  const handler = module[method] as RouteHandler | undefined;
  if (handler) {
    server.log.debug(`${method} ${fileRouteServerPath}`);
    const methodFunctionName = method.toLowerCase() as keyof Pick<
      FastifyInstance,
      "get" | "put" | "delete" | "head" | "post" | "options" | "patch"
    >;
    server[methodFunctionName](
      fileRouteServerPath,
      handler.opts || {},
      handler as RouteHandlerMethod
    );
  }
}

export async function registerRoutes(
  fastify: FastifyInstance,
  folder: string,
  prefix = ""
): Promise<void> {
  const registerRoutesFolders = fs
    .readdirSync(folder, { withFileTypes: true })
    .map(async (folderOrFile) => {
      const currentPath = path.join(folder, folderOrFile.name);

      if (isHangingRoute(currentPath)) {
        return;
      }

      const routeServerPath = pathToUrl(`${prefix}/${folderOrFile.name}`);

      if (folderOrFile.isDirectory()) {
        if (
          folderOrFile.name.startsWith(".") ||
          folderOrFile.name.startsWith("_")
        ) {
          return;
        }

        await registerRoutes(fastify, currentPath, routeServerPath);
      } else if (folderOrFile.isFile()) {
        const { ext, name } = path.parse(folderOrFile.name);

        if (name !== ALLOWED_ROUTE_FILE && !ALLOWED_EXTENSIONS.includes(ext)) {
          return;
        }

        let fileRouteServerPath = prefix;

        if (fileRouteServerPath.length === 0) {
          fileRouteServerPath = "/";
        }

        const module = await import(currentPath);

        for (const method of Object.values(methods)) {
          addRequestHandler(
            module,
            method as HTTPMethods,
            fastify,
            fileRouteServerPath
          );
        }
      }
    });

  await Promise.all(registerRoutesFolders);
}
