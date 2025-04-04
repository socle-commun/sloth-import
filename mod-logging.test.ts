import { $Import } from "./mod.ts";
import {
  assertEquals,
  assert,
} from "https://deno.land/std@0.220.1/assert/mod.ts";

const metaUrl = import.meta.url;

Deno.test("[Logging] - active les logs (console)", async () => {
  const logs: unknown[] = [];
  const originalConsoleLog = console.log;
  console.log = (...args: unknown[]) => logs.push(args);

  try {
    $Import.config.logging = true;
    await $Import(metaUrl, "./_fixtures/simple.ts");
    assert(logs.length > 0);
    assert(logs.some((args: unknown) => (args as string[]).join(" ").includes("Imported file")));
  } finally {
    $Import.config.logging = false;
    console.log = originalConsoleLog;
  }
});

Deno.test("[Logging] - utilise une fonction personnalisée", async () => {
  const customLogs: unknown[][] = [];

  $Import.config.logging = (...args: unknown[]) => {
    customLogs.push(args);
  };

  await $Import(metaUrl, "./_fixtures/simple.ts");

  assert(customLogs.length > 0);
  assert(customLogs[0].some((arg) => String(arg).includes("Imported file")));

  $Import.config.logging = false;
});

Deno.test("[Logging] - pas de log quand désactivé", async () => {
  const logs: unknown[] = [];
  const originalConsoleLog = console.log;
  console.log = (...args: unknown[]) => logs.push(args);

  try {
    $Import.config.logging = false;
    await $Import(metaUrl, "./_fixtures/simple.ts");
    assertEquals(logs.length, 0);
  } finally {
    console.log = originalConsoleLog;
  }
});
