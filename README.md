# Fastify Directory Based Routes

A Fastify plugin that enables file system-based routing, utilizing directories to specify URL segments matched by the router.

## Installation
```sh
pnpm add @vfshera/fastify-dir-routes
```
```sh
npm i @vfshera/fastify-dir-routes
```

## Setup

Server
```ts
import fastify, { type FastifyInstance } from "fastify";
import FastifyDirRoutes from "@vfshera/fastify-dir-routes";

const main = async (): Promise<void> => {
  const app: FastifyInstance = fastify({ logger: { level: "debug" } });

  await app.register(FastifyDirRoutes, {
    routesDir: "./routes",
    prefix: "/api",
  });

  app.printRoutes();
  await app.listen({ port: 3000 });
};
main().catch((error) => { 
  console.log(error);
});

```
Directory structure

```sh
├── src
   ├── server.ts
└──routes
    ├── (common)
    │   ├── booking
    │   │   └── route.ts  -- /api/booking
    │   └── route.ts
    ├── _ignore_me        -- will be ignored
    │   └── route.ts
    ├── profile
    │   └── [...all]
    │       └── route.ts  -- /api/profile/*
    ├── route.ts          -- /api/
    └── user
        └── [id]-[name]
            ├── route.ts  -- /api/user/:id-:name
            └── settings  -- will be ignored because there is no route.ts
```

## Usage
Export a function with HTTP Method name in uppercase as the function name.

In `routes/user/[id]-[name]` which resolves to `/api/user/:id-:name`
```ts

import type { RouteHandler } from  "@vfshera/fastify-dir-routes";

// handles post request to /api/user/:id-:name
export const POST: RouteHandler<{
  Params: { id: string; name: string };
}> = async (req, res) => {

  res.send({ message: `Hello ${req.params.name} with id ${req.params.id}` });
};


```
Handler with Options.

`routes/(common)/booking` resolves to `/api/booking`

```ts 

import type { RouteHandler } from "@vfshera/fastify-dir-routes";

// handles post request to /api/booking
export const POST: RouteHandler<{
  Body: { name: string };
  Reply: { message: string };
}> = async (request, reply) => {
  reply.send({ message: `Thank you for booking ${request.body.name}!` });
};

POST.opts = {
  schema: {
    body: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
      },
      required: ["name"],
    },
  },
};

```

Catch All route (wildcard route)

`routes/profile/[...all]` resolves to `/api/profile/*`

The plugin provides the wildcard value in params with same name used in directory.

`[...all]` gives adds `all` property in params. Accessed as `req.params.all`

`[...slug]` will provides `slug` in params. Accessed as `req.params.slug`

```ts

import type { RouteHandler } from "@vfshera/fastify-dir-routes";

// handles get request to /api/profile/*
export const GET: RouteHandler<{
  Params: { all: string };
  Reply: { message: string };
}> = async (req, res) => {

  return res.send({ message: `Catched all: '${req.params.all}'` });
};

```

**Check the examples folder for more**

## Acknowledgements

This project builds upon Great work from the following packages:

- [Fastify File Routes](https://github.com/spa5k/fastify-file-routes)
- [Fastify Now](https://github.com/yonathan06/fastify-now)


## License

[MIT](./LICENSE)

