import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

export function getProjectMDXFilePath(slug: string): string {
  return path.join(CONTENT_DIR, `${slug}.mdx`);
}

export function projectMDXExists(slug: string): boolean {
  return fs.existsSync(getProjectMDXFilePath(slug));
}
