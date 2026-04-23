import { NextResponse } from "next/server";
import { readProjects, writeProjects, type ProjectItem } from "@/lib/cms";

function noStoreHeaders() {
  return { "Cache-Control": "no-store, no-cache, must-revalidate" };
}

export async function GET() {
  try {
    const projects = await readProjects();
    return NextResponse.json(projects, { headers: noStoreHeaders() });
  } catch (error) {
    console.error("Failed to read projects:", error);
    return NextResponse.json(
      { error: "Failed to read projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ProjectItem>;
    const title = `${body.title ?? ""}`.trim();
    const description = `${body.description ?? ""}`.trim();
    const tech = Array.isArray(body.tech)
      ? body.tech.map((item) => `${item}`.trim()).filter(Boolean)
      : [];
    const link = `${body.link ?? ""}`.trim();
    const github = `${body.github ?? ""}`.trim();

    if (!title || !description || tech.length === 0) {
      return NextResponse.json(
        { error: "title, description, and tech are required" },
        { status: 400 }
      );
    }

    const projects = await readProjects();
    const nextProject: ProjectItem = {
      id: crypto.randomUUID(),
      title,
      description,
      tech,
      link,
      github,
      createdAt: new Date().toISOString(),
    };

    const nextProjects = [nextProject, ...projects];
    await writeProjects(nextProjects);

    return NextResponse.json(nextProject, { headers: noStoreHeaders() });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = `${searchParams.get("id") ?? ""}`.trim();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const projects = await readProjects();
    const nextProjects = projects.filter((project) => project.id !== id);

    if (nextProjects.length === projects.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await writeProjects(nextProjects);
    return NextResponse.json(
      { success: true, deletedId: id },
      { headers: noStoreHeaders() }
    );
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
