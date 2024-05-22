import { describe, expect, it } from "vitest";
import { handleParams } from "../src/utils";

describe("handle params", () => {
  it("replaces single parameter with colon", () => {
    expect(handleParams("[spark]")).toBe(":spark");
  });

  it("replaces parameter in a route", () => {
    expect(handleParams("/user/[id]")).toBe("/user/:id");
  });

  it("replaces wildcard parameter with asterisk", () => {
    expect(handleParams("/user/[...id]")).toBe("/user/*");
  });

  it("returns unchanged string for a path without parameters", () => {
    expect(handleParams("/profile/settings")).toBe("/profile/settings");
  });

  it("replaces parameter in the middle of a route", () => {
    expect(handleParams("/profile/[id]/spark")).toBe("/profile/:id/spark");
  });

  it("replaces multiple parameters separated by hyphen", () => {
    expect(handleParams("/profile/[id]-[spark]")).toBe("/profile/:id-:spark");
  });

  it("replaces multiple parameters in a complex route", () => {
    expect(handleParams("/profile/[id]-[spark]/[nice]")).toBe(
      "/profile/:id-:spark/:nice"
    );
  });

  it("removes .ts extension", () => {
    expect(handleParams("/profile/settings.ts")).toBe("/profile/settings");
  });

  it("removes .js extension", () => {
    expect(handleParams("/script/main.js")).toBe("/script/main");
  });

  it("removes parenthesis", () => {
    expect(handleParams("/path/(to)/file")).toBe("/path/file");
  });

  it("handles mixed parameter and wildcard", () => {
    expect(handleParams("/user/[id]/[...rest]")).toBe("/user/:id/*");
  });

  it("handles multiple parameters with different formats", () => {
    expect(handleParams("/user/[id]-[spark]/settings/[...rest]")).toBe(
      "/user/:id-:spark/settings/*"
    );
  });
});
