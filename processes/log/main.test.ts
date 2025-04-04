import { log } from "./main.ts";
import { config } from "../../config.ts";
import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";

Deno.test("log - utilise console.log si logging = true", () => {
  const messages: unknown[][] = [];
  const originalConsole = console.log;
  console.log = (...args: unknown[]) => messages.push(args);

  try {
    config.logging = true;
    log("message test");
    assertEquals(messages.length, 1);
    assertEquals(messages[0][1], "message test");
  } finally {
    console.log = originalConsole;
    config.logging = false;
  }
});

Deno.test("log - utilise fonction personnalisée si définie", () => {
  const logs: unknown[][] = [];

  config.logging = (...args: unknown[]) => logs.push(args);

  log("test perso");

  assertEquals(logs.length, 1);
  assertEquals(logs[0][1], "test perso");

  config.logging = false;
});

Deno.test("log - ne fait rien si logging désactivé", () => {
  const messages: unknown[][] = [];
  const originalConsole = console.log;
  console.log = (...args: unknown[]) => messages.push(args);

  try {
    config.logging = false;
    log("should not appear");
    assertEquals(messages.length, 0);
  } finally {
    console.log = originalConsole;
  }
});
