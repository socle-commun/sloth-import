import { config } from "../../config.ts";
import { handleImportError } from "./main.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.220.1/assert/mod.ts";

Deno.test("handleImportError - utilise le fallback si défini", () => {
  const fallback = (_path: string, _err: unknown) => ({ fallback: true });
  const result = handleImportError("path.ts", new Error("fail"), fallback);
  assertEquals(result.fallback, true);
});

Deno.test("handleImportError - relance une erreur sinon", () => {
  assertThrows(() => {
    handleImportError("bad.ts", new Error("fail"));
  }, Error, "Failed to import bad.ts");
});

Deno.test("handleImportError - ne doit pas log si logging désactivé", () => {
  const originalConsoleError = console.error;
  let called = false;
  console.error = () => {
    called = true;
  };

  try {
    config.logging = false;
    const fallback = () => ({ silent: true });
    handleImportError("no-log.ts", new Error("invisible"), fallback);
    // ❌ console.error ne devrait pas être appelé
    if (called) {
      throw new Error("console.error a été appelé alors qu’il ne devrait pas");
    }
  } finally {
    console.error = originalConsoleError;
  }
});