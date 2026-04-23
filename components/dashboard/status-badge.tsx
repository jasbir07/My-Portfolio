"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Code2, BookOpen, Rocket, Coffee, Moon } from "lucide-react";

type Status = "coding" | "learning" | "shipping" | "break" | "offline";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; icon: typeof Code2; color: string }> = {
  coding: {
    label: "Coding",
    icon: Code2,
    color: "text-neon-green bg-neon-green/10 border-neon-green/30",
  },
  learning: {
    label: "Learning",
    icon: BookOpen,
    color: "text-neon-blue bg-neon-blue/10 border-neon-blue/30",
  },
  shipping: {
    label: "Shipping",
    icon: Rocket,
    color: "text-neon-purple bg-neon-purple/10 border-neon-purple/30",
  },
  break: {
    label: "On Break",
    icon: Coffee,
    color: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  },
  offline: {
    label: "Offline",
    icon: Moon,
    color: "text-muted-foreground bg-muted/50 border-border",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full border font-mono text-sm",
        config.color,
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            status !== "offline" && "bg-current"
          )}
        />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
      </span>
      <Icon className="w-4 h-4" />
      <span>{config.label}</span>
    </motion.div>
  );
}
