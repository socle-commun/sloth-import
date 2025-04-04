import { importFile } from "./main.ts";
import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.220.1/assert/mod.ts";

Deno.test("importFile - autorise les extensions valides", async () => {
  const url = new URL("../../_fixtures/allowtest/valid.ts", import.meta.url);
  const mod = await importFile<{ ok: boolean }>(url, { allow: ["ts"] });
  if(!mod) throw new Error("Module is undefined");
  assertEquals(mod.ok, true);
});

