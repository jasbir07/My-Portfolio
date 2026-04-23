"use client";

import { useParams, notFound } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  BookOpen,
} from "lucide-react";
import type { BlogItem } from "@/lib/cms";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data, isLoading } = useSWR<BlogItem[]>("/api/blogs", fetcher);
  const post = (Array.isArray(data) ? data : []).find((item) => item.id === slug);

  if (!isLoading && !post) notFound();

  return (
    <div className="min-h-screen px-4">
      <article className="max-w-3xl mx-auto">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="py-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pb-8 border-b border-border"
        >
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            {isLoading ? "Loading..." : post?.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post?.createdAt ?? "").toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Blog entry
            </span>
          </div>
        </motion.header>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none py-12"
        >
          <div
            className="space-y-6 text-foreground/90 leading-relaxed
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-12 [&_h2]:mb-4
              [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:text-foreground/80
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
              [&_li]:text-foreground/80
              [&_strong]:text-foreground [&_strong]:font-semibold
              [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-primary [&_code]:text-sm [&_code]:font-mono
              [&_pre]:bg-secondary/50 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-border
              [&_pre_code]:bg-transparent [&_pre_code]:p-0"
            dangerouslySetInnerHTML={{
              __html: `${post?.summary ?? ""}\n\n${post?.content ?? ""}`
                .replace(/\n## /g, "\n<h2>")
                .replace(/\n### /g, "\n<h3>")
                .replace(/## /g, "<h2>")
                .replace(/### /g, "<h3>")
                .replace(/<h2>([^<]+)/g, "<h2>$1</h2>")
                .replace(/<h3>([^<]+)/g, "<h3>$1</h3>")
                .replace(/```(\w+)\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>")
                .replace(/`([^`]+)`/g, "<code>$1</code>")
                .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                .replace(/\n\n/g, "</p><p>")
                .replace(/^/, "<p>")
                .replace(/$/, "</p>"),
            }}
          />
        </motion.div>

        {/* Back to Blog */}
        <div className="pb-20">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Read more posts
          </Link>
        </div>
      </article>
    </div>
  );
}
