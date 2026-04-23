"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ALLOWED_STATUSES, type StatusData, type StatusValue } from "@/lib/status";

const ADMIN_PASSWORD = "build-admin-2026";
type AdminTab = "status" | "projects" | "blogs";

type ProjectItem = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  link: string;
  github: string;
  createdAt: string;
};

type BlogItem = {
  id: string;
  title: string;
  summary: string;
  content: string;
  createdAt: string;
};

export default function AdminPage() {
  const [passwordInput, setPasswordInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("status");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Status form
  const [project, setProject] = useState("DSA Visualizer");
  const [status, setStatus] = useState<StatusValue>("Coding");

  // Projects form + list
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTech, setProjectTech] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  // Blogs form + list
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSummary, setBlogSummary] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogs, setBlogs] = useState<BlogItem[]>([]);

  const handleUnlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordInput !== ADMIN_PASSWORD) {
      setError("Incorrect password.");
      setMessage(null);
      return;
    }
    setIsUnlocked(true);
    setError(null);
    setMessage("Access granted.");
  };

  const fetchProjects = useCallback(async () => {
    const response = await fetch("/api/projects", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const data = (await response.json()) as ProjectItem[] | { error?: string };
    if (!response.ok) {
      throw new Error(
        "error" in data ? data.error ?? "Failed to load projects." : "Failed to load projects."
      );
    }
    setProjects(Array.isArray(data) ? data : []);
  }, []);

  const fetchBlogs = useCallback(async () => {
    const response = await fetch("/api/blogs", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const data = (await response.json()) as BlogItem[] | { error?: string };
    if (!response.ok) {
      throw new Error(
        "error" in data ? data.error ?? "Failed to load blogs." : "Failed to load blogs."
      );
    }
    setBlogs(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    if (!isUnlocked) return;
    const load = async () => {
      setIsLoadingLists(true);
      try {
        await Promise.all([fetchProjects(), fetchBlogs()]);
      } catch (loadError) {
        const msg =
          loadError instanceof Error ? loadError.message : "Failed to load content.";
        setError(msg);
      } finally {
        setIsLoadingLists(false);
      }
    };
    load();
  }, [isUnlocked, fetchProjects, fetchBlogs]);

  const handleStatusSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          project,
          status,
        }),
      });

      const data = (await response.json()) as Partial<StatusData> & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to update status.");
      }

      setMessage(`Updated at ${new Date(data.updatedAt ?? "").toLocaleString()}`);
    } catch (submitError) {
      const msg =
        submitError instanceof Error
          ? submitError.message
          : "Failed to update status.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProjectSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          title: projectTitle,
          description: projectDescription,
          tech: projectTech
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          link: projectLink,
          github: projectGithub,
        }),
      });

      const data = (await response.json()) as Partial<ProjectItem> & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to add project.");
      }

      setProjectTitle("");
      setProjectDescription("");
      setProjectTech("");
      setProjectLink("");
      setProjectGithub("");
      setMessage("Project added successfully.");
      await fetchProjects();
    } catch (submitError) {
      const msg =
        submitError instanceof Error ? submitError.message : "Failed to add project.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlogSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          title: blogTitle,
          summary: blogSummary,
          content: blogContent,
        }),
      });

      const data = (await response.json()) as Partial<BlogItem> & { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to add blog.");
      }

      setBlogTitle("");
      setBlogSummary("");
      setBlogContent("");
      setMessage("Blog post added successfully.");
      await fetchBlogs();
    } catch (submitError) {
      const msg =
        submitError instanceof Error ? submitError.message : "Failed to add blog.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Failed to delete project.");
      setMessage("Project deleted.");
      await fetchProjects();
    } catch (deleteError) {
      const msg =
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete project.";
      setError(msg);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`/api/blogs?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Failed to delete blog.");
      setMessage("Blog post deleted.");
      await fetchBlogs();
    } catch (deleteError) {
      const msg =
        deleteError instanceof Error ? deleteError.message : "Failed to delete blog.";
      setError(msg);
    }
  };

  const inputClassName =
    "w-full rounded-lg border border-white/10 bg-zinc-950/70 px-3 py-2 text-sm text-foreground outline-none focus:border-primary";

  return (
    <div className="min-h-screen px-4 bg-background">
      <div className="max-w-6xl mx-auto py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-xl p-6 shadow-xl shadow-black/30"
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Manage status, projects, and blogs.
          </p>

          {!isUnlocked ? (
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-foreground">Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={inputClassName}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-medium transition hover:opacity-90"
              >
                Unlock
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["status", "Status"],
                    ["projects", "Projects"],
                    ["blogs", "Blogs"],
                  ] as const
                ).map(([tabKey, label]) => (
                  <button
                    key={tabKey}
                    onClick={() => setActiveTab(tabKey)}
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      activeTab === tabKey
                        ? "bg-primary text-primary-foreground"
                        : "bg-zinc-800/60 text-zinc-200 hover:bg-zinc-800"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {activeTab === "status" && (
                <form onSubmit={handleStatusSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-foreground">Project name</label>
                    <input
                      type="text"
                      value={project}
                      onChange={(e) => setProject(e.target.value)}
                      className={inputClassName}
                      placeholder="e.g. DSA Visualizer"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-foreground">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as StatusValue)}
                      className={inputClassName}
                    >
                      {ALLOWED_STATUSES.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-medium transition hover:opacity-90 disabled:opacity-60"
                  >
                    {isSubmitting ? "Updating..." : "Update Status"}
                  </button>
                </form>
              )}

              {activeTab === "projects" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <form onSubmit={handleProjectSubmit} className="space-y-3">
                    <h2 className="text-lg font-semibold text-foreground">
                      Add Project
                    </h2>
                    <input
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className={inputClassName}
                      placeholder="Title"
                      required
                    />
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className={inputClassName}
                      placeholder="Description"
                      rows={3}
                      required
                    />
                    <input
                      value={projectTech}
                      onChange={(e) => setProjectTech(e.target.value)}
                      className={inputClassName}
                      placeholder="Tech stack (comma separated)"
                      required
                    />
                    <input
                      value={projectLink}
                      onChange={(e) => setProjectLink(e.target.value)}
                      className={inputClassName}
                      placeholder="Live link"
                    />
                    <input
                      value={projectGithub}
                      onChange={(e) => setProjectGithub(e.target.value)}
                      className={inputClassName}
                      placeholder="GitHub link"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-medium transition hover:opacity-90 disabled:opacity-60"
                    >
                      {isSubmitting ? "Adding..." : "Add Project"}
                    </button>
                  </form>
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-foreground">
                      Existing Projects
                    </h2>
                    {isLoadingLists ? (
                      <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-auto pr-1">
                        {projects.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-lg border border-white/10 bg-zinc-950/40 p-3 flex items-start justify-between gap-3"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteProject(item.id)}
                              className="text-xs px-2 py-1 rounded bg-red-500/15 text-red-300 hover:bg-red-500/25 transition"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                        {projects.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            No projects yet.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "blogs" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <form onSubmit={handleBlogSubmit} className="space-y-3">
                    <h2 className="text-lg font-semibold text-foreground">Add Blog</h2>
                    <input
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      className={inputClassName}
                      placeholder="Title"
                      required
                    />
                    <textarea
                      value={blogSummary}
                      onChange={(e) => setBlogSummary(e.target.value)}
                      className={inputClassName}
                      placeholder="Summary"
                      rows={2}
                      required
                    />
                    <textarea
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      className={inputClassName}
                      placeholder="Content"
                      rows={6}
                      required
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-medium transition hover:opacity-90 disabled:opacity-60"
                    >
                      {isSubmitting ? "Adding..." : "Add Blog"}
                    </button>
                  </form>
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-foreground">
                      Existing Blogs
                    </h2>
                    {isLoadingLists ? (
                      <p className="text-sm text-muted-foreground">Loading...</p>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-auto pr-1">
                        {blogs.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-lg border border-white/10 bg-zinc-950/40 p-3 flex items-start justify-between gap-3"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {item.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {item.summary}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDeleteBlog(item.id)}
                              className="text-xs px-2 py-1 rounded bg-red-500/15 text-red-300 hover:bg-red-500/25 transition"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                        {blogs.length === 0 && (
                          <p className="text-sm text-muted-foreground">No blogs yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {message && <p className="mt-4 text-sm text-emerald-300">{message}</p>}
          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        </motion.div>
      </div>
    </div>
  );
}
