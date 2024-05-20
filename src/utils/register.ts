import fs from "node:fs";
import path from "node:path";
import type { FastifyInstance, HTTPMethods, RouteHandlerMethod } from "fastify";
import { extractCatchAll, pathToUrl } from "./transformers";

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

function isHangingRoute(path: string) {
	return ALLOWED_EXTENSIONS.map((ext) =>
		path.endsWith(`${HANGING_ROUTE}${ext}`),
	).some((isHanging) => isHanging);
}

function addRequestHandler(
	module: Record<HTTPMethods, unknown>,
	method: HTTPMethods,
	server: FastifyInstance,
	fileRouteServerPath: string,
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
			handler as RouteHandlerMethod,
		);
	}
}

export async function registerRoutes(
	fastify: FastifyInstance,
	folder: string,
	prefix = "",
): Promise<void> {
	const catchAllParamKeys = new Map<string, string>();

	const registerRoutesHandlers = fs
		.readdirSync(folder, { withFileTypes: true })
		.map(async (entry) => {
			const currentPath = path.join(folder, entry.name);

			if (isHangingRoute(currentPath)) {
				return;
			}

			const routeServerPath = pathToUrl(`${prefix}/${entry.name}`);

			if (entry.isDirectory()) {
				if (entry.name.startsWith(".") || entry.name.startsWith("_")) {
					return;
				}

				await registerRoutes(fastify, currentPath, routeServerPath);
			} else if (entry.isFile()) {
				const { ext, name } = path.parse(entry.name);

				if (name !== ALLOWED_ROUTE_FILE && !ALLOWED_EXTENSIONS.includes(ext)) {
					return;
				}

				let fileRouteServerPath = prefix;

				if (fileRouteServerPath.length === 0) {
					fileRouteServerPath = "/";
				}

				const catchAllKey = extractCatchAll(currentPath);

				if (fileRouteServerPath.endsWith("/*") && catchAllKey) {
					const routePath = fileRouteServerPath.replace(/\/\*$/, "");

					catchAllParamKeys.set(routePath, catchAllKey);
				}

				const module = await import(currentPath);

				for (const method of Object.values(methods)) {
					addRequestHandler(
						module,
						method as HTTPMethods,
						fastify,
						fileRouteServerPath,
					);
				}
			}
		});

	fastify.addHook("onRequest", async (request, reply) => {
		for (const [path, key] of catchAllParamKeys) {
			if (request.url.startsWith(path)) {
				request.params = {
					...(request.params as Record<string, unknown>),
					[key]: (request.params as Record<string, unknown>)["*"],
				};
			}
		}
	});

	await Promise.all(registerRoutesHandlers);
}
