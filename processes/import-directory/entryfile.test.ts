import { importDirectory } from "./main.ts";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.220.1/assert/mod.ts";

// 📁 Structure attendue dans _fixtures/entrydir/ :
// ├─ a.ts
// ├─ b.ts
// └─ sub/
//     └─ main.ts

Deno.test("importDirectory - importe aussi mod.ts dans les sous-dossiers", async () => {
  const dir = new URL("../../_fixtures/entrydir/", import.meta.url);
  const result = await importDirectory<{ id: number }>(dir);

  const keys = Object.keys(result);

  const fileA = keys.find((k) => k.endsWith("/entrydir/a.ts"));
  const fileB = keys.find((k) => k.endsWith("/entrydir/b.ts"));
  const subMain = keys.find((k) => k.endsWith("/entrydir/sub/mod.ts"));

  assertExists(fileA);
  assertExists(fileB);
  assertExists(subMain);

  assertEquals(result[fileA!].id, 1);
  assertEquals(result[fileB!].id, 2);
  assertEquals(result[subMain!].id, 42);
});

Deno.test("importDirectory - respecte un entryFileName personnalisé", async () => {
  // 📁 _fixtures/entrydir2/sub/entry.ts
  const dir = new URL("../../_fixtures/entrydir2/", import.meta.url);
  const result = await importDirectory<{ id: number }>(dir, {
    entryFileName: "entry.ts",
  });

  const subEntry = Object.keys(result).find((k) =>
    k.endsWith("/entrydir2/sub/entry.ts")
  );

  assertExists(subEntry);
  assertEquals(result[subEntry!].id, 99);
});
