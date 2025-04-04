import { resolvePaths } from "./main.ts";
import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";

const meta = import.meta.url;

Deno.test("resolvePaths - un seul chemin", () => {
  const result = resolvePaths(meta, "./_fixtures/simple.ts");
  assertEquals(result.length, 1);
  assertEquals(result[0] instanceof URL, true);
  assertEquals(result[0].href.endsWith("_fixtures/simple.ts"), true);
});

Deno.test("resolvePaths - plusieurs chemins", () => {
  const result = resolvePaths(meta, [
    "./_fixtures/simple.ts",
    "./_fixtures/folder/",
  ]);
  assertEquals(result.length, 2);
  assertEquals(result[0] instanceof URL, true);
  assertEquals(result[1] instanceof URL, true);
});
