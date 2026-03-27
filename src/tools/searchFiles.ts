import fs from "fs";
import path from "path";

export function searchFiles(keyword: string): string[] {
  const results: string[] = [];

  function search(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (file === "node_modules") continue;
        search(fullPath);
      } else {
        if (file.toLowerCase().includes(keyword.toLowerCase())) {
          results.push(fullPath);
        }
      }
    }
  }

  search(process.cwd());

  return results;
}