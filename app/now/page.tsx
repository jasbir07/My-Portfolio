"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Code2,
  BookOpen,
  Brain,
  Target,
  Sparkles,
  Calendar,
} from "lucide-react";

interface NowSection {
  icon: typeof Clock;
  title: string;
  items: string[];
  color: string;
}

const sections: NowSection[] = [
  {
    icon: Code2,
    title: "What I&apos;m Building",
    items: [
      "DSA Visualizer - Interactive algorithm animations",
      "Developer dashboard with real-time integrations",
      "Code animation tool for technical content",
    ],
    color: "text-neon-green bg-neon-green/10 border-neon-green/30",
  },
  {
    icon: BookOpen,
    title: "What I&apos;m Learning",
    items: [
      "System Design fundamentals and patterns",
      "Advanced TypeScript techniques",
      "WebGL and 3D graphics programming",
      "Distributed systems architecture",
    ],
    color: "text-neon-blue bg-neon-blue/10 border-neon-blue/30",
  },
  {
    icon: Brain,
    title: "What I&apos;m Thinking About",
    items: [
      "How to make developer tools more intuitive",
      "The future of AI-assisted coding",
      "Building in public and sharing knowledge",
      "Work-life balance in tech",
    ],
    color: "text-neon-purple bg-neon-purple/10 border-neon-purple/30",
  },
  {
    icon: Target,
    title: "Current Goals",
    items: [
      "Ship DSA Visualizer by end of month",
      "Contribute to open source weekly",
      "Write 2 technical blog posts",
      "Reach 1000 GitHub followers",
    ],
    color: "text-neon-cyan bg-neon-cyan/10 border-neon-cyan/30",
  },
];

const currentlyReading = [
  { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann" },
  { title: "The Pragmatic Programmer", author: "David Thomas & Andrew Hunt" },
];

const currentlyListening = [
  { title: "Syntax.fm", type: "Podcast" },
  { title: "The Changelog", type: "Podcast" },
];

export default function NowPage() {
  return (
    <div className="min-h-screen px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Now
              </h1>
              <p className="text-muted-foreground">
                What I&apos;m focused on right now
              </p>
            </div>
          </div>

          {/* Last updated */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mt-6"
          >
            <Calendar className="w-4 h-4" />
            <span>
              Last updated:{" "}
              <span className="font-mono text-foreground">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </span>
          </motion.div>

          {/* Intro */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-muted-foreground leading-relaxed"
          >
            This is a{" "}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              now page
            </a>
            . It&apos;s a snapshot of what I&apos;m currently working on, learning, and
            thinking about. I update it regularly to keep track of my focus areas.
          </motion.p>
        </motion.header>

        {/* Main sections */}
        <section className="space-y-6 pb-12">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${section.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-bold text-lg text-foreground">
                    {section.title.replace(/&apos;/g, "'")}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 + i * 0.05 }}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </section>

        {/* Reading & Listening */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {/* Currently Reading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="font-bold text-lg text-foreground">
                Currently Reading
              </h2>
            </div>
            <ul className="space-y-4">
              {currentlyReading.map((book, i) => (
                <li key={i} className="space-y-1">
                  <p className="font-medium text-foreground">{book.title}</p>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Currently Listening */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-400/10 border border-rose-400/30 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-rose-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                </svg>
              </div>
              <h2 className="font-bold text-lg text-foreground">
                Currently Listening
              </h2>
            </div>
            <ul className="space-y-4">
              {currentlyListening.map((item, i) => (
                <li key={i} className="space-y-1">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.type}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
