import { describe, expect, test } from "bun:test";
import { getHrefPath, isPathActive } from "../components/patterns/navigation-path";

describe("getHrefPath", () => {
  test("strips fragments", () => {
    expect(getHrefPath("/blog#latest")).toBe("/blog");
  });
});

describe("isPathActive", () => {
  test("home matches only exactly", () => {
    expect(isPathActive("/", "/")).toBe(true);
    expect(isPathActive("/blog", "/")).toBe(false);
  });
  test("section matches itself and children", () => {
    expect(isPathActive("/blog", "/blog")).toBe(true);
    expect(isPathActive("/blog/post-1", "/blog")).toBe(true);
    expect(isPathActive("/blogroll", "/blog")).toBe(false);
  });
});
