import { importDirectory } from "./main.ts";
import { assertObjectMatch, assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";

Deno.test("importDirectory - ignore les fichiers qui matchent les patterns glob", async () => {
  const folderUrl = new URL("../../_fixtures/entrydir/", import.meta.url);

  const mods = await importDirectory(folderUrl, {
    ignore: ["**/a.ts", "**/sub/*"], // ignore "a.ts" et "sub/main.ts"
  });

  // on attend seulement "b.ts"
  const importedKeys = Object.keys(mods).sort();

  assertEquals(importedKeys.length, 1);
  assertObjectMatch(mods, {
    [new URL("../../_fixtures/entrydir/b.ts", import.meta.url).href]: { id: 2 },
  });
});

Deno.test("importDirectory - importe tout si aucun fichier ne correspond aux patterns", async () => {
  const folderUrl = new URL("../../_fixtures/entrydir/", import.meta.url);

  const mods = await importDirectory(folderUrl, {
    ignore: ["*.notfound.ts"], // pattern qui ne match rien
  });

  const keys = Object.keys(mods).sort();

  assertEquals(keys.length, 3);
  assertObjectMatch(mods, {
    [new URL("../../_fixtures/entrydir/a.ts", import.meta.url).href]: { id: 1 },
    [new URL("../../_fixtures/entrydir/b.ts", import.meta.url).href]: { id: 2 },
    [new URL("../../_fixtures/entrydir/sub/mod.ts", import.meta.url).href]: { id: 42 },
  });
});
