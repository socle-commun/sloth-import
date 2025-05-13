import { importDirectory } from "./main.ts";
import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";

Deno.test("importDirectory - charge tous les fichiers et sous-dossiers", async () => {
    const dir = new URL("../../_fixtures/entrydir/", import.meta.url);
    const modules = await importDirectory<{ id: number }>(dir);
  
    const keys = Object.keys(modules).sort();
    const values = Object.values(modules);
  
    // Vérifie que chaque module a un champ .id de type number
    for (const mod of values) {
      if (typeof mod.id !== "number") {
        throw new Error(`Le module ${JSON.stringify(mod)} n’a pas un id de type number`);
      }
    }
  
    // Vérifie que les fichiers sont bien ceux attendus
    assertEquals(keys.map(k => k.split("/").pop()).sort(), ["a.ts", "b.ts", "mod.ts"]);
  });
  
