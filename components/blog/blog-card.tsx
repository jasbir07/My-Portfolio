"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  createdAt: string;
}

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn("group relative")}
    >
      <Link href={`/blog/${post.id}`}>
        <div
          className={cn(
            "relative h-full glass-card rounded-2xl overflow-hidden transition-all duration-300",
            "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
            "p-6"
          )}
        >
          {/* Background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Content */}
          <div className="relative z-10">
            {/* Title */}
            <h2 className="font-bold text-foreground group-hover:text-primary transition-colors mb-3 text-xl">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm line-clamp-2">
              {post.summary}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Read more indicator */}
              <motion.div
                initial={{ x: 0, opacity: 0.5 }}
                whileHover={{ x: 5, opacity: 1 }}
                className="flex items-center gap-1 text-primary font-medium text-sm"
              >
                Read
                <ArrowUpRight className="w-4 h-4" />
              </motion.div>
            </div>
          </div>

          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>
    </motion.article>
  );
}
