import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import kleur from "kleur";
import type { DirRoutesPluginOptions } from "./types";
import { makeError, registerRoutes } from "./utils";

const DirRoutesPlugin: FastifyPluginAsync<DirRoutesPluginOptions> = async (
  fastify,
  options
) => {
  if (!options.routesDir) {
    const message: string = makeError("dir must be specified");
    throw new Error(kleur.red(message));
  }

  if (typeof options.routesDir !== "string") {
    const message: string = makeError(
      "dir must be the path of file system routes directory"
    );
    throw new Error(kleur.red(message));
  }

  let dirPath: string;

  if (path.isAbsolute(options.routesDir)) {
    dirPath = options.routesDir;
  } else if (path.isAbsolute(process.argv[1] as string)) {
    dirPath = path.join(process.argv[1] as string, "..", options.routesDir);
  } else {
    dirPath = path.join(
      process.cwd(),
      process.argv[1] as string,
      "..",
      options.routesDir
    );
  }

  if (!fs.existsSync(dirPath)) {
    const message: string = makeError(`dir ${dirPath} does not exists`);
    throw new Error(kleur.red(message));
  }

  if (!fs.statSync(dirPath).isDirectory()) {
    const message: string = makeError(`dir ${dirPath} must be a directory`);
    throw new Error(kleur.red(message));
  }

  try {
    await registerRoutes(fastify, dirPath, options.prefix ?? "");
  } catch (error) {
    let msg = "";

    if (error instanceof Error) {
      msg = error.message;
    }
    throw new Error(kleur.red(makeError(msg)));
  }
};

export default fp<DirRoutesPluginOptions>(DirRoutesPlugin);
