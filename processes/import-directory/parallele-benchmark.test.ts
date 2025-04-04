import { importDirectory as importParallel } from "./main.ts";
import { importDirectory as importSerial } from "./__serial.ts"; // copie manuelle de l'ancienne version
import { assertEquals } from "https://deno.land/std@0.220.1/assert/mod.ts";

const dir = new URL("../../_fixtures/entrydir/", import.meta.url);

Deno.test("Benchmark - parallèle plus rapide ou égal à série", async () => {
  const t1 = performance.now();
  const serial = await importSerial<{ id: number }>(dir);
  const t2 = performance.now();

  const t3 = performance.now();
  const parallel = await importParallel<{ id: number }>(dir);
  const t4 = performance.now();

  assertEquals(Object.keys(serial).length, Object.keys(parallel).length);

  const serialTime = t2 - t1;
  const parallelTime = t4 - t3;

  console.log(`[⏱️ Benchmark] Série    : ${serialTime.toFixed(2)}ms`);
  console.log(`[⏱️ Benchmark] Parallèle: ${parallelTime.toFixed(2)}ms`);

  // Ne pas échouer si égal, mais prévenir si régression
  if (parallelTime > serialTime + 10) {
    throw new Error("Parallèle plus lent que la version série");
  }
});
