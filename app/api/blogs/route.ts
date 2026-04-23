import { NextResponse } from "next/server";
import { readBlogs, writeBlogs, type BlogItem } from "@/lib/cms";

function noStoreHeaders() {
  return { "Cache-Control": "no-store, no-cache, must-revalidate" };
}

export async function GET() {
  try {
    const blogs = await readBlogs();
    return NextResponse.json(blogs, { headers: noStoreHeaders() });
  } catch (error) {
    console.error("Failed to read blogs:", error);
    return NextResponse.json(
      { error: "Failed to read blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<BlogItem>;
    const title = `${body.title ?? ""}`.trim();
    const summary = `${body.summary ?? ""}`.trim();
    const content = `${body.content ?? ""}`.trim();

    if (!title || !summary || !content) {
      return NextResponse.json(
        { error: "title, summary, and content are required" },
        { status: 400 }
      );
    }

    const blogs = await readBlogs();
    const nextBlog: BlogItem = {
      id: crypto.randomUUID(),
      title,
      summary,
      content,
      createdAt: new Date().toISOString(),
    };

    const nextBlogs = [nextBlog, ...blogs];
    await writeBlogs(nextBlogs);

    return NextResponse.json(nextBlog, { headers: noStoreHeaders() });
  } catch (error) {
    console.error("Failed to create blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
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

    const blogs = await readBlogs();
    const nextBlogs = blogs.filter((blog) => blog.id !== id);

    if (nextBlogs.length === blogs.length) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    await writeBlogs(nextBlogs);
    return NextResponse.json(
      { success: true, deletedId: id },
      { headers: noStoreHeaders() }
    );
  } catch (error) {
    console.error("Failed to delete blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
