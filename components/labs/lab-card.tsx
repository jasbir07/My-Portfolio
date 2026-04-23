"use client";

import { motion } from "framer-motion";
import { FlaskConical, ExternalLink, Github, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LabExperiment {
  id: string;
  title: string;
  description: string;
  status: "in-progress" | "completed" | "paused" | "concept";
  techStack: string[];
  progress?: number;
  liveUrl?: string;
  githubUrl?: string;
  lastUpdated: string;
}

interface LabCardProps {
  experiment: LabExperiment;
  index: number;
}

const statusConfig = {
  "in-progress": {
    label: "In Progress",
    color: "text-neon-green bg-neon-green/10 border-neon-green/30",
    icon: Zap,
  },
  completed: {
    label: "Completed",
    color: "text-neon-blue bg-neon-blue/10 border-neon-blue/30",
    icon: FlaskConical,
  },
  paused: {
    label: "Paused",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    icon: Clock,
  },
  concept: {
    label: "Concept",
    color: "text-neon-purple bg-neon-purple/10 border-neon-purple/30",
    icon: FlaskConical,
  },
};

export function LabCard({ experiment, index }: LabCardProps) {
  const status = statusConfig[experiment.status];
  const StatusIcon = status.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden group"
    >
      {/* Background effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30"
            >
              <FlaskConical className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                {experiment.title}
              </h3>
              <p className="text-xs text-muted-foreground font-mono">
                {experiment.lastUpdated}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium",
              status.color
            )}
          >
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {experiment.description}
        </p>

        {/* Progress bar (if in progress) */}
        {experiment.status === "in-progress" && experiment.progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-mono text-primary">{experiment.progress}%</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${experiment.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              />
            </div>
          </div>
        )}

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {experiment.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 rounded-md bg-secondary/50 text-secondary-foreground text-xs font-mono"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-2">
          {experiment.liveUrl && (
            <motion.a
              href={experiment.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Try it
            </motion.a>
          )}
          {experiment.githubUrl && (
            <motion.a
              href={experiment.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary/50 text-secondary-foreground text-sm font-medium hover:bg-secondary transition-colors"
            >
              <Github className="w-4 h-4" />
              Code
            </motion.a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
