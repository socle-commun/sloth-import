# $Import 🦥 – Powerful Dynamic Import for Deno

> ⚡ A flexible and efficient utility for loading Deno modules dynamically — one file, many files, or entire folders.

![Deno](https://img.shields.io/badge/Deno-🦕-000?logo=deno)  
![Module Type](https://img.shields.io/badge/Type-Library-informational)  

---

## ✨ Features

- 📄 Import a single file dynamically
- 📁 Import all `.ts`, `.js`, etc. files in a folder
- 🔍 Auto-detect `main.ts` (or custom entry) in subdirectories
- 🔁 Handle multiple paths
- 🚀 Parallel loading of multiple files for optimal performance
- 🧩 Import callback
- 📜 Filter allowed extensions
- 🔍 Optional logging
- 🧯 Fallback support on error

---

## 📦 Installation

```ts
import { $Import } from "https://raw.githubusercontent.com/socle-commun/lib-core-deno/main/libs/import/mod.ts";
```

---

## 🧪 Usage

```ts
const meta = import.meta.url;

// Import a single file
const mod = await $Import(meta, "./services/foo.ts");

// Import multiple files and folders
const all = await $Import(meta, [
  "./services/foo.ts",
  "./modules/",
]);

// Import with callback
await $Import(meta, "./config.ts", {
  callback: async (mod) => {
    console.log("Module loaded:", mod);
  },
});
```

---

## 🔧 API

```ts
$Import<T>(
  metaUrl: string,
  path: string | string[],
  options?: SlothImportOptions<T>
): Promise<T>;
```

### Options

```ts
interface SlothImportOptions<T> {
  callback?: (mod: T) => Promise<void>;
  entryFileName?: string; // default: "main.ts"
  allow?: SlothImportAllowedExtension[]; // default: ["ts"]
}
```

---

## ⚙️ Global Configuration

```ts
$Import.logging = true; // or custom logger function
$Import.fallback = (path, err) => ({ error: true });

$Import.config = {
  logging: false,
  entryFileName: "entry.ts",
  allow: ["ts"],
};
```

---

## 🗂 Auto-import `main.ts` from folders

Folder structure:

```
features/
├─ feature-a/
│  └─ main.ts
├─ feature-b/
│  └─ main.ts
```

```ts
await $Import(import.meta.url, "./features/");
```

Each `main.ts` file will be automatically imported.

---

## 🔤 Supported Extensions

```
["ts", "js", "jsx", "tsx", "mts", "cts"]
```

Default to `["ts", "js"]`
Customizable via `options.allow` or `config.allow`.

---

## 🧱 Structure

```
libs/import/
├─ mod.ts                  # Main entrypoint
├─ config.ts               # Runtime config
├─ types.ts                # Type declarations
├─ constants.ts
├─ processes/
│  ├─ import-file/
│  ├─ import-directory/
│  ├─ resolve-path/
│  ├─ handle-error/
│  └─ log/
└─ _fixtures/              # Test modules
```

---

## ✅ Test

```bash
deno task test
```

Each internal process has independent tests.

---

## 🐢 About Sloth

`$Import` is part of the **Sloth 🦥** utility toolkit — designed to be minimal, lazy, and powerful for Deno developers.

---

## 🛡 License

MIT © 2025 [Mistifiou](https://github.com/Mistifiou)