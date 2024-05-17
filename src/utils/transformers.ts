import path from "node:path";
import { ALLOWED_ROUTE_FILE } from "../consts";

export const pathToUrl = (filePath: string): string => {
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
};

export const handleParams = (token: string): string => {
  const squareBracketRegex: RegExp = /\[(.*)\]/gu;
  const tsRegex: RegExp = /\.ts$/u;
  const jsRegex: RegExp = /\.js$/u;
  const wildCardRouteRegex: RegExp = /\[\.\.\..+\]/gu;
  const multipleParamRegex: RegExp = /\]-\[/gu;
  const routeParamRegex: RegExp = /\]\/\[/gu;
  const parenthesesRegex: RegExp = /\(.*?\)/gu;

  return token
    .replace(tsRegex, "")
    .replace(jsRegex, "")
    .replace(parenthesesRegex, "")
    .replace(wildCardRouteRegex, () => "*")
    .replace(squareBracketRegex, (_, match) => `:${String(match)}`)
    .replace(multipleParamRegex, "-:")
    .replace(routeParamRegex, "/:");
};
