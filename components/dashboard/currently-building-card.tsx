"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Clock } from "lucide-react";

type BuildStatus = "Coding" | "Learning" | "Shipping";

type StatusResponse = {
  project: string;
  status: BuildStatus;
  updatedAt: string;
};

const FALLBACK_STATUS: StatusResponse = {
  project: "DSA Visualizer",
  status: "Coding",
  updatedAt: new Date().toISOString(),
};

const STATUS_STYLES: Record<BuildStatus, string> = {
  Coding: "bg-emerald-500/10 text-emerald-300 border-emerald-400/30",
  Learning: "bg-yellow-500/10 text-yellow-300 border-yellow-400/30",
  Shipping: "bg-blue-500/10 text-blue-300 border-blue-400/30",
};

const STATUS_GLOW: Record<BuildStatus, string> = {
  Coding: "shadow-[0_0_30px_rgba(16,185,129,0.16)]",
  Learning: "shadow-[0_0_30px_rgba(250,204,21,0.14)]",
  Shipping: "shadow-[0_0_30px_rgba(59,130,246,0.14)]",
};

const STATUS_DOT: Record<BuildStatus, string> = {
  Coding: "bg-emerald-400",
  Learning: "bg-yellow-400",
  Shipping: "bg-blue-400",
};

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleString();
}

function formatUpdatedAgo(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Updated just now";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60_000));

  if (diffMinutes < 1) return "Updated just now";
  if (diffMinutes === 1) return "Updated 1 minute ago";
  if (diffMinutes < 60) return `Updated ${diffMinutes} minutes ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours === 1) return "Updated 1 hour ago";
  return `Updated ${diffHours} hours ago`;
}

function isSameStatus(a: StatusResponse, b: StatusResponse) {
  return (
    a.project === b.project &&
    a.status === b.status &&
    a.updatedAt === b.updatedAt
  );
}

async function fetchCurrentStatus(): Promise<StatusResponse> {
  const response = await fetch("/api/status", {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch status");
  }

  const data = (await response.json()) as Partial<StatusResponse>;
  const isValidStatus =
    data.status === "Coding" ||
    data.status === "Learning" ||
    data.status === "Shipping";

  if (
    typeof data.project !== "string" ||
    !isValidStatus ||
    typeof data.updatedAt !== "string"
  ) {
    throw new Error("Invalid status response");
  }

  return {
    project: data.project,
    status: data.status,
    updatedAt: data.updatedAt,
  };
}

export function CurrentlyBuildingCard() {
  const [status, setStatus] = useState<StatusResponse>(FALLBACK_STATUS);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const refreshStatus = useCallback(async () => {
    try {
      const next = await fetchCurrentStatus();
      setStatus((prev) => (isSameStatus(prev, next) ? prev : next));
      setIsError(false);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
    const intervalId = setInterval(refreshStatus, 10_000);

    return () => clearInterval(intervalId);
  }, [refreshStatus]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-xl p-6 relative overflow-hidden"
      >
        <div className="space-y-4 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-zinc-800/80" />
              <div className="space-y-2">
                <div className="h-4 w-36 rounded bg-zinc-800/80" />
                <div className="h-3 w-20 rounded bg-zinc-800/60" />
              </div>
            </div>
            <div className="h-7 w-24 rounded-full bg-zinc-800/70" />
          </div>
          <div className="h-6 w-2/3 rounded bg-zinc-800/80" />
          <div className="h-4 w-1/2 rounded bg-zinc-800/60" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className={`rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/30 ${
        STATUS_GLOW[status.status]
      }`}
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-mono text-lg font-bold text-foreground">
                Currently Building
              </h3>
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Loading..." : "Live status"}
              </p>
            </div>
          </div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${STATUS_STYLES[status.status]}`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-pulse ${STATUS_DOT[status.status]}`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${STATUS_DOT[status.status]}`}
              />
            </span>
            <span>{status.status}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xl font-bold text-foreground truncate">
            {status.project}
          </h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span title={formatUpdatedAt(status.updatedAt)}>
              {formatUpdatedAgo(status.updatedAt)}
            </span>
          </div>
          {isError && (
            <p className="text-xs text-amber-300">
              Unable to refresh right now. Showing last known status.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
