"use client";

import { motion } from "framer-motion";
import { Github, GitCommit } from "lucide-react";
import { cn } from "@/lib/utils";

interface GitHubGraphProps {
  contributions: number[];
  totalContributions: number;
  streak: number;
}

export function GitHubGraph({ contributions, totalContributions, streak }: GitHubGraphProps) {
  const maxContribution = Math.max(...contributions, 1);
  
  const getIntensity = (count: number) => {
    if (count === 0) return "bg-secondary";
    const ratio = count / maxContribution;
    if (ratio > 0.75) return "bg-neon-green";
    if (ratio > 0.5) return "bg-neon-green/70";
    if (ratio > 0.25) return "bg-neon-green/40";
    return "bg-neon-green/20";
  };

  // Generate weeks (last 12 weeks)
  const weeks = [];
  for (let i = 0; i < 12; i++) {
    const weekData = contributions.slice(i * 7, (i + 1) * 7);
    weeks.push(weekData);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
            <Github className="w-5 h-5 text-foreground" />
          </div>
          <h3 className="font-mono text-lg font-bold text-foreground">
            GitHub Activity
          </h3>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-neon-green" />
            <span className="text-muted-foreground">
              <span className="font-mono text-foreground">{totalContributions}</span> commits
            </span>
          </div>
          <div className="text-muted-foreground">
            <span className="font-mono text-foreground">{streak}</span> day streak
          </div>
        </div>
      </div>

      {/* Contribution Graph */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <motion.div
                key={`${weekIndex}-${dayIndex}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (weekIndex * 7 + dayIndex) * 0.005 }}
                whileHover={{ scale: 1.5 }}
                className={cn(
                  "w-3 h-3 rounded-sm cursor-pointer transition-colors",
                  getIntensity(day)
                )}
                title={`${day} contributions`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-secondary" />
          <div className="w-3 h-3 rounded-sm bg-neon-green/20" />
          <div className="w-3 h-3 rounded-sm bg-neon-green/40" />
          <div className="w-3 h-3 rounded-sm bg-neon-green/70" />
          <div className="w-3 h-3 rounded-sm bg-neon-green" />
        </div>
        <span>More</span>
      </div>
    </motion.div>
  );
}
