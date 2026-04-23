"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { ProjectCard, type Project } from "@/components/projects/project-card";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const { data, error, isLoading } = useSWR<Project[]>("/api/projects", fetcher);
  const projects = Array.isArray(data) ? data : [];

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projects;
    const query = search.toLowerCase();
    return projects.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tech.some((tech) => tech.toLowerCase().includes(query))
    );
  }, [projects, search]);

  return (
    <div className="min-h-screen px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Projects
              </h1>
              <p className="text-muted-foreground">
                A collection of things I&apos;ve built
              </p>
            </div>
          </div>

          <div className="mt-8">
            <input
              type="text"
              placeholder="Search projects by title or tech..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full max-w-md rounded-xl bg-secondary/50 border border-border text-foreground px-4 py-3 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </motion.header>

        {/* Projects Grid */}
        <section className="pb-20">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="glass-card rounded-2xl h-56 animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-red-300">Failed to load projects.</p>
            </motion.div>
          )}

          {!isLoading && !error && filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground">No projects found.</p>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
