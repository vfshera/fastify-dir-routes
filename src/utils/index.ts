export * from "./register";
export * from "./transformers";

export function makeError(message: string) {
  return `[ERROR] fastify-dir-routes: ${message}`;
}
