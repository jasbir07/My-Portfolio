"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { CurrentlyBuildingCard } from "@/components/dashboard/currently-building-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { SpotifyCard } from "@/components/dashboard/spotify-card";
import { VisitorCounter } from "@/components/dashboard/visitor-counter";
import { GitHubGraph } from "@/components/dashboard/github-graph";
import { SkeletonCard } from "@/components/skeleton-card";
import {
  useGitHubActivity,
  useDashboardData,
} from "@/hooks/use-dashboard-data";

export default function HomePage() {
  const { data: githubData, isLoading: githubLoading } = useGitHubActivity();
  const { data: dashboardData } = useDashboardData();

  return (
    <div className="min-h-screen px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-12 md:py-20"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-muted-foreground"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Developer Presence Dashboard</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground">
              <span className="block">Building the</span>
              <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-neon-cyan bg-clip-text text-transparent">
                future of web
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Full-stack developer crafting beautiful, performant applications.
              Currently focused on interactive visualizations and developer tools.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/projects">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center gap-2 neon-glow"
                >
                  View Projects
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium border border-border hover:border-primary/50 transition-colors"
                >
                  Get in Touch
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Dashboard Grid */}
        <section className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Project */}
            <CurrentlyBuildingCard />

            {/* Activity Feed */}
            {githubLoading ? (
              <SkeletonCard lines={6} />
            ) : (
              <ActivityFeed
                activities={
                  githubData?.activities || [
                    {
                      id: "1",
                      type: "commit",
                      title: "Pushed code to GitHub",
                      description: "feat: add binary tree visualization",
                      timestamp: "10 minutes ago",
                    },
                    {
                      id: "2",
                      type: "coding",
                      title: "Working on DSA Visualizer",
                      timestamp: "1 hour ago",
                    },
                  ]
                }
              />
            )}
          </div>
        </section>

        {/* Second Row */}
        <section className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Spotify */}
            <SpotifyCard />

            {/* Visitor Counter */}
            <VisitorCounter
              totalVisitors={dashboardData?.visitorStats.total || 12847}
              todayVisitors={dashboardData?.visitorStats.today || 142}
              trend={dashboardData?.visitorStats.trend || 12}
            />

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="font-mono text-lg font-bold text-foreground mb-4">
                Quick Links
              </h3>
              <div className="space-y-2">
                {[
                  { label: "GitHub", href: "https://github.com" },
                  { label: "LinkedIn", href: "https://linkedin.com" },
                  { label: "Twitter", href: "https://twitter.com" },
                  { label: "Resume", href: "#" },
                ].map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <span className="font-medium">{link.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* GitHub Graph */}
        <section className="py-4">
          {githubLoading ? (
            <SkeletonCard className="h-48" lines={2} />
          ) : (
            <GitHubGraph
              contributions={
                githubData?.contributions ||
                Array.from({ length: 84 }, () => Math.floor(Math.random() * 10))
              }
              totalContributions={githubData?.totalContributions || 847}
              streak={githubData?.streak || 23}
            />
          )}
        </section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="py-12 text-center text-muted-foreground text-sm"
        >
          <p>
            Built with{" "}
            <span className="text-primary">Next.js</span>,{" "}
            <span className="text-accent">Tailwind CSS</span>, and{" "}
            <span className="text-neon-cyan">Framer Motion</span>
          </p>
          <p className="mt-2 font-mono text-xs">
            Last updated: April 2026
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
