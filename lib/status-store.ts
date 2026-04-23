import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { isStatusValue, type StatusData } from "@/lib/status";

const DATA_DIR = path.join(process.cwd(), "data");
const STATUS_FILE_PATH = path.join(DATA_DIR, "status.json");

export async function readStatusFile(): Promise<StatusData> {
  const raw = await readFile(STATUS_FILE_PATH, "utf-8");
  const parsed = JSON.parse(raw) as Partial<StatusData>;

  if (
    typeof parsed.project !== "string" ||
    !isStatusValue(`${parsed.status ?? ""}`) ||
    typeof parsed.updatedAt !== "string"
  ) {
    throw new Error("Invalid status.json format");
  }

  return {
    project: parsed.project,
    status: parsed.status,
    updatedAt: parsed.updatedAt,
  };
}

export async function writeStatusFile(nextData: StatusData) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STATUS_FILE_PATH, JSON.stringify(nextData, null, 2), "utf-8");
}
