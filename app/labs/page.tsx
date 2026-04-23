"use client";

import { motion } from "framer-motion";
import { FlaskConical, Lightbulb } from "lucide-react";
import { LabCard, type LabExperiment } from "@/components/labs/lab-card";

const experiments: LabExperiment[] = [
  {
    id: "1",
    title: "DSA Visualizer",
    description:
      "Interactive visualization of data structures and algorithms. Watch sorting algorithms, tree traversals, and graph algorithms come to life with step-by-step animations.",
    status: "in-progress",
    techStack: ["React", "TypeScript", "Canvas", "Framer Motion"],
    progress: 68,
    githubUrl: "https://github.com",
    lastUpdated: "Updated 2 hours ago",
  },
  {
    id: "2",
    title: "Neural Network Playground",
    description:
      "A visual tool for understanding neural networks. Draw your own network architecture and watch data flow through layers in real-time.",
    status: "concept",
    techStack: ["WebGL", "TensorFlow.js", "React"],
    lastUpdated: "Concept phase",
  },
  {
    id: "3",
    title: "Code Animation Tool",
    description:
      "Create beautiful code walkthroughs with syntax highlighting, smooth transitions, and export to video or GIF for social media.",
    status: "in-progress",
    techStack: ["React", "Shiki", "FFmpeg", "Web Workers"],
    progress: 35,
    githubUrl: "https://github.com",
    lastUpdated: "Updated yesterday",
  },
  {
    id: "4",
    title: "Terminal Portfolio",
    description:
      "An interactive terminal-based portfolio website. Navigate with commands, view projects, and even play games.",
    status: "completed",
    techStack: ["React", "xterm.js", "TypeScript"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    lastUpdated: "Completed",
  },
  {
    id: "5",
    title: "Git Visualizer",
    description:
      "Visualize git operations in real-time. See how commits, branches, merges, and rebases work under the hood.",
    status: "paused",
    techStack: ["D3.js", "isomorphic-git", "React"],
    progress: 45,
    githubUrl: "https://github.com",
    lastUpdated: "Paused - 2 weeks ago",
  },
  {
    id: "6",
    title: "Regex Builder",
    description:
      "A visual regex builder with real-time matching, explanation of patterns, and common regex recipes.",
    status: "completed",
    techStack: ["React", "TypeScript", "Web Workers"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
    lastUpdated: "Completed",
  },
];

export default function LabsPage() {
  const inProgress = experiments.filter((e) => e.status === "in-progress");
  const completed = experiments.filter((e) => e.status === "completed");
  const other = experiments.filter(
    (e) => e.status === "paused" || e.status === "concept"
  );

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
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Labs
              </h1>
              <p className="text-muted-foreground">
                Experimental projects and ideas
              </p>
            </div>
          </div>

          {/* Intro text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 glass-card rounded-2xl p-6 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-neon-cyan" />
            </div>
            <div>
              <h2 className="font-bold text-foreground mb-1">
                Welcome to my lab
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is where I experiment with new ideas, learn new technologies,
                and build things just for fun. Some experiments become full projects,
                others remain as learning exercises. All of them help me grow as a
                developer.
              </p>
            </div>
          </motion.div>
        </motion.header>

        {/* In Progress Section */}
        {inProgress.length > 0 && (
          <section className="pb-12">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold text-foreground mb-6 flex items-center gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green" />
              </span>
              Currently Building
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inProgress.map((experiment, index) => (
                <LabCard key={experiment.id} experiment={experiment} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Section */}
        {completed.length > 0 && (
          <section className="pb-12">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold text-foreground mb-6"
            >
              Completed Experiments
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completed.map((experiment, index) => (
                <LabCard
                  key={experiment.id}
                  experiment={experiment}
                  index={index + inProgress.length}
                />
              ))}
            </div>
          </section>
        )}

        {/* Other Section */}
        {other.length > 0 && (
          <section className="pb-20">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-bold text-foreground mb-6"
            >
              Ideas & Paused
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {other.map((experiment, index) => (
                <LabCard
                  key={experiment.id}
                  experiment={experiment}
                  index={index + inProgress.length + completed.length}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
