import { NextResponse } from "next/server";
import { normalizeStatus, type StatusData } from "@/lib/status";
import { readStatusFile, writeStatusFile } from "@/lib/status-store";

export async function GET() {
  try {
    const data = await readStatusFile();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (error) {
    console.error("Failed to read status data:", error);
    return NextResponse.json(
      { error: "Failed to read status data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      project?: string;
      status?: string;
    };

    const project = `${body?.project ?? ""}`.trim();
    const status = normalizeStatus(`${body?.status ?? ""}`);

    if (!project) {
      return NextResponse.json(
        { error: "project is required" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "status must be one of: Coding, Learning, Shipping" },
        { status: 400 }
      );
    }

    const nextData: StatusData = {
      project,
      status,
      updatedAt: new Date().toISOString(),
    };

    await writeStatusFile(nextData);

    return NextResponse.json(nextData, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (error) {
    console.error("Failed to update status data:", error);
    return NextResponse.json(
      { error: "Failed to update status data" },
      { status: 500 }
    );
  }
}
