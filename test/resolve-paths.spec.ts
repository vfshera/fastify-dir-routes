import { describe, expect, it } from "vitest";
import { pathToUrl } from "../src/utils/transformers";

describe("resolves url", () => {
  it("removes .ts extension and retains directory structure", () => {
    expect(pathToUrl("blog/articles/route.ts")).toBe("/blog/articles");
  });

  it("replaces parameter in a route and removes .js extension", () => {
    expect(pathToUrl("products/[id]/route.js")).toBe("/products/:id");
  });

  it("replaces wildcard parameter and removes .ts extension", () => {
    expect(pathToUrl("profile/[...all]/route.ts")).toBe("/profile/*");
  });

  it("removes parenthesis and replaces parameter", () => {
    expect(pathToUrl("dashboard/(common)/[appId]/route.js")).toBe(
      "/dashboard/:appId"
    );
  });

  it("returns root URL for root path", () => {
    expect(pathToUrl("/")).toBe("/");
  });

  it("removes .ts extension for root route file", () => {
    expect(pathToUrl("/route.ts")).toBe("/");
  });

  it("removes .js extension for root route file", () => {
    expect(pathToUrl("/route.js")).toBe("/");
  });

  it("replaces multiple parameters separated by hyphen", () => {
    expect(pathToUrl("/blog/[id]-[slug]/route.ts")).toBe("/blog/:id-:slug");
  });

  it("handles an empty string", () => {
    expect(pathToUrl("")).toBe("/");
  });

  it("handles path with mixed parameters and wildcards", () => {
    expect(pathToUrl("/user/[id]/[...rest]/route.js")).toBe("/user/:id/*");
  });

  it("handles path with parenthesis and extensions", () => {
    expect(pathToUrl("/path/(to)/file/route.ts")).toBe("/path/file");
  });

  it("handles multiple nested parameters", () => {
    expect(pathToUrl("/a/[b]/c/[d]/route.js")).toBe("/a/:b/c/:d");
  });

  it("handles trailing slash after transformation", () => {
    expect(pathToUrl("/user/profile/")).toBe("/user/profile");
  });
});
