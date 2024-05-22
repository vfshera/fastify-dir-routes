import { afterAll, describe, expect, it } from "vitest";

import { initilize } from "./server";

describe("routes tests", async () => {
  const app = await initilize();

  afterAll(async () => {
    await app.close();
  });

  it("GET /api", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api",
    });
    expect(response.statusCode).toBe(200);
  });

  it("GET /api Response", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api",
    });
    expect(response.json()).toStrictEqual({ hello: "world" });
  });

  it("POST /api/user/100-Human Response", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/user/100-Human",
    });
    expect(response.json()).toStrictEqual({
      message: "Hello Human with id 100",
    });
  });
});
