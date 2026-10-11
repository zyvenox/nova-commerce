import { access, copyFile } from "node:fs/promises";
import path from "node:path";

const indexPath = path.resolve("dist", "index.html");
const fallbackPath = path.resolve("dist", "200.html");

try {
  await access(indexPath);
} catch {
  console.error("Could not find dist/index.html. Run the Vite build first.");

  process.exitCode = 1;
}

if (process.exitCode !== 1) {
  try {
    await copyFile(indexPath, fallbackPath);

    console.log("Surge SPA fallback created: dist/200.html");
  } catch (error) {
    console.error("Could not create the Surge fallback:", error);
    process.exitCode = 1;
  }
}
