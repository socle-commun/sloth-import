import { $Import } from "./mod.ts";
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.220.1/assert/mod.ts";

const metaUrl = import.meta.url;

Deno.test("[Fallback] - utilise fallback sur erreur", async () => {
  $Import.config.fallback = <T>() => {
    return { fallback: true } as T;
  };

  const mod = await $Import<{ fallback: boolean }>(
    metaUrl,
    "./_fixtures/inexistant.ts",
  );

  assertEquals(mod.fallback, true);

  $Import.config.fallback = undefined; // clean
});

Deno.test("[Fallback] - lève une erreur si pas de fallback", async () => {
    $Import.config.fallback = undefined;
  
    try {
      await $Import(metaUrl, "./_fixtures/inexistant.ts");
      throw new Error("La fonction aurait dû lever une erreur mais ne l’a pas fait.");
    } catch (err) {
      // Type + contenu du message
      if (!(err instanceof Error)) {
        throw new Error("Erreur levée non conforme : n’est pas une instance d’Error.");
      }
  
      if (!err.message.includes("Failed to import")) {
        throw new Error(`Message d’erreur inattendu : ${err.message}`);
      }
      
      if(!err.cause) {
        throw new Error(`L'erreur doit avoir une cause : ${err.message}`);
      }
    }
  });
  
