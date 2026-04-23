import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  link: string;
  github: string;
  createdAt: string;
};

export type BlogItem = {
  id: string;
  title: string;
  summary: string;
  content: string;
  createdAt: string;
};

function getFilePath(fileName: string) {
  return path.join(DATA_DIR, fileName);
}

async function readJsonFile<T>(fileName: string): Promise<T> {
  const raw = await readFile(getFilePath(fileName), "utf-8");
  return JSON.parse(raw) as T;
}

async function atomicWriteJsonFile(fileName: string, data: unknown) {
  await mkdir(DATA_DIR, { recursive: true });
  const targetPath = getFilePath(fileName);
  const tempPath = `${targetPath}.tmp`;
  await writeFile(tempPath, JSON.stringify(data, null, 2), "utf-8");
  await rename(tempPath, targetPath);
}

export async function readProjects() {
  const data = await readJsonFile<ProjectItem[]>("projects.json");
  return Array.isArray(data) ? data : [];
}

export async function writeProjects(projects: ProjectItem[]) {
  await atomicWriteJsonFile("projects.json", projects);
}

export async function readBlogs() {
  const data = await readJsonFile<BlogItem[]>("blogs.json");
  return Array.isArray(data) ? data : [];
}

export async function writeBlogs(blogs: BlogItem[]) {
  await atomicWriteJsonFile("blogs.json", blogs);
}
