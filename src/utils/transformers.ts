import path from "node:path";
import { ALLOWED_ROUTE_FILE } from "../consts";

export function pathToUrl(filePath: string): string {
	const url: string = `/${filePath}`;

	if (url.length === 1) {
		return url;
	}

	let resultUrl: string = url
		.split(path.sep)
		.map((part) => handleParams(part))
		.join("/");

	if (resultUrl.endsWith(ALLOWED_ROUTE_FILE)) {
		resultUrl = resultUrl.replace(ALLOWED_ROUTE_FILE, "");
	}

	if (resultUrl.endsWith("/")) {
		resultUrl = resultUrl.slice(0, -1);
	}

	if (resultUrl.length === 0) {
		return "/";
	}

	return resultUrl.replace("//", "/");
}

export const squareBracketRegex: RegExp = /\[(.*)\]/gu;
export const tsRegex: RegExp = /\.ts$/u;
export const jsRegex: RegExp = /\.js$/u;
export const wildCardRouteRegex: RegExp = /\[\.\.\..+\]/gu;
export const multipleParamRegex: RegExp = /\]-\[/gu;
export const routeParamRegex: RegExp = /\]\/\[/gu;
export const parenthesesRegex: RegExp = /\(.*?\)/gu;

export function handleParams(token: string): string {
	return token
		.replace(tsRegex, "")
		.replace(jsRegex, "")
		.replace(parenthesesRegex, "")
		.replace(wildCardRouteRegex, () => "*")
		.replace(squareBracketRegex, (_, match) => `:${String(match)}`)
		.replace(multipleParamRegex, "-:")
		.replace(routeParamRegex, "/:");
}

export function extractCatchAll(routePath: string) {
	const routeDir = routePath.split("/").slice(-2, -1)[0] ?? "";
	const matches = routeDir.match(wildCardRouteRegex);

	let key = undefined;
	if (matches) {
		key = matches[0].replace(/\[\.\.\.(.+)\]/, "$1");
	}

	return key;
}
