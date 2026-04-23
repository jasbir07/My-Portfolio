"use client";

import { motion } from "framer-motion";
import { GitCommit, BookOpen, Code2, Rocket, Coffee, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityType = "commit" | "learning" | "coding" | "deploy" | "break" | "milestone";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const activityConfig: Record<ActivityType, { icon: typeof GitCommit; color: string }> = {
  commit: { icon: GitCommit, color: "text-neon-green bg-neon-green/10" },
  learning: { icon: BookOpen, color: "text-neon-blue bg-neon-blue/10" },
  coding: { icon: Code2, color: "text-neon-purple bg-neon-purple/10" },
  deploy: { icon: Rocket, color: "text-amber-400 bg-amber-400/10" },
  break: { icon: Coffee, color: "text-muted-foreground bg-muted/50" },
  milestone: { icon: Zap, color: "text-neon-cyan bg-neon-cyan/10" },
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card rounded-2xl p-6"
    >
      <h3 className="font-mono text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-primary" />
        Activity Feed
      </h3>

      <div className="space-y-1">
        {activities.map((activity, index) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative pl-8 pb-4 last:pb-0"
            >
              {/* Timeline line */}
              {index < activities.length - 1 && (
                <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
              )}

              {/* Icon */}
              <div
                className={cn(
                  "absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center",
                  config.color
                )}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Content */}
              <div className="ml-4">
                <p className="text-sm font-medium text-foreground">
                  {activity.title}
                </p>
                {activity.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activity.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
                  {activity.timestamp}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
