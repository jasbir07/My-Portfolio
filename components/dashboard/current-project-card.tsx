"use client";

import { motion } from "framer-motion";
import { Code2, GitBranch, Clock, ExternalLink } from "lucide-react";
import { StatusBadge } from "./status-badge";

interface CurrentProjectCardProps {
  project: {
    name: string;
    description: string;
    status: "coding" | "learning" | "shipping" | "break" | "offline";
    branch: string;
    lastUpdated: string;
    progress: number;
  };
}

export function CurrentProjectCard({ project }: CurrentProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden group"
    >
      {/* Background glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            >
              <Code2 className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h3 className="font-mono text-lg font-bold text-foreground">
                Currently Building
              </h3>
              <p className="text-sm text-muted-foreground">Active workspace</p>
            </div>
          </div>
          <StatusBadge status={project.status} />
        </div>

        {/* Project Info */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xl font-bold text-foreground neon-text">
              {project.name}
            </h4>
            <p className="text-muted-foreground text-sm mt-1">
              {project.description}
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <GitBranch className="w-4 h-4 text-accent" />
              <span className="font-mono">{project.branch}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>Updated {project.lastUpdated}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-mono text-primary">{project.progress}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              />
            </div>
          </div>

          {/* Action */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl text-primary font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <span>View Project</span>
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
