import fs from "fs";
import path from "path";

export function readFile(filePath: string) {
  try {
    const fullPath = path.join(process.cwd(), filePath);

    const content = fs.readFileSync(fullPath, "utf-8");

    return content;
  } catch (err) {
    return "Error reading file";
  }
}