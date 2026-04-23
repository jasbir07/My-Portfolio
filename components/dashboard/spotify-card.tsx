"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Music, Pause, Play, SkipForward } from "lucide-react";
import Image from "next/image";

interface SpotifySong {
  title: string;
  artist: string;
  albumImageUrl: string;
  songUrl: string;
  isPlaying: boolean;
  reason?: "premium_required" | "unavailable";
}

interface SpotifyCardProps {
  track?: unknown;
  lastPlayed?: unknown;
}

const EMPTY_SONG: SpotifySong = {
  isPlaying: false,
  title: "",
  artist: "",
  albumImageUrl: "",
  songUrl: "",
  reason: "unavailable",
};

function isSameSong(a: SpotifySong, b: SpotifySong) {
  return (
    a.isPlaying === b.isPlaying &&
    a.title === b.title &&
    a.artist === b.artist &&
    a.albumImageUrl === b.albumImageUrl &&
    a.songUrl === b.songUrl &&
    a.reason === b.reason
  );
}

async function fetchSpotifySong(): Promise<SpotifySong> {
  const response = await fetch("/api/spotify/now-playing", {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    return EMPTY_SONG;
  }

  const data = (await response.json()) as Partial<SpotifySong>;
  return {
    isPlaying: Boolean(data.isPlaying),
    title: data.title ?? "",
    artist: data.artist ?? "",
    albumImageUrl: data.albumImageUrl ?? "",
    songUrl: data.songUrl ?? "",
    reason:
      data.reason === "premium_required" || data.reason === "unavailable"
        ? data.reason
        : "unavailable",
  };
}

export function SpotifyCard({}: SpotifyCardProps) {
  const [song, setSong] = useState<SpotifySong>(EMPTY_SONG);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSong = useCallback(async () => {
    try {
      const nextSong = await fetchSpotifySong();
      setSong((prev) => (isSameSong(prev, nextSong) ? prev : nextSong));
    } catch {
      setSong((prev) => (isSameSong(prev, EMPTY_SONG) ? prev : EMPTY_SONG));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSong();
    const intervalId = setInterval(refreshSong, 10_000);

    return () => {
      clearInterval(intervalId);
    };
  }, [refreshSong]);

  const hasSong = Boolean(song.title);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.01, y: -2 }}
        className="rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-black/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-neon-green/10 flex items-center justify-center">
            <Music className="w-5 h-5 text-neon-green" />
          </div>
          <h3 className="font-mono text-lg font-bold text-foreground">
            Now Playing
          </h3>
        </div>
        <p className="text-muted-foreground text-sm">
          Loading Spotify...
        </p>
      </motion.div>
    );
  }

  if (!hasSong) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.01, y: -2 }}
        className="rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-black/30"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-neon-green/10 flex items-center justify-center">
            <Music className="w-5 h-5 text-neon-green" />
          </div>
          <h3 className="font-mono text-lg font-bold text-foreground">
            Now Playing
          </h3>
        </div>
        <p className="text-muted-foreground text-sm">Nothing playing right now</p>
        {song.reason === "premium_required" && (
          <p className="text-xs text-amber-300/90 mt-2">
            Spotify Premium is required for this app&apos;s playback data.
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className={`rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/30 ${
        song.isPlaying ? "shadow-[0_0_35px_rgba(16,185,129,0.16)]" : ""
      }`}
    >
      {/* Background gradient based on album art */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-green/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-neon-green/10 flex items-center justify-center">
            <Music className="w-5 h-5 text-neon-green" />
          </div>
          <div>
            <h3 className="font-mono text-lg font-bold text-foreground">
              {song.isPlaying ? "Now Playing" : "Last Played"}
            </h3>
            <p
              className={`text-xs mt-1 ${
                song.isPlaying ? "text-emerald-400" : "text-muted-foreground"
              }`}
            >
              {song.isPlaying ? "● Listening Now" : "Last Played"}
            </p>
          </div>
        </div>

        {/* Track Info */}
        <div className="flex gap-4">
          {/* Album Art */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg shadow-black/40 transition-all duration-300 ${
              song.isPlaying ? "ring-1 ring-emerald-400/30" : "ring-1 ring-white/10"
            }`}
          >
            <Image
              src={song.albumImageUrl}
              alt={song.title}
              fill
              className="object-cover"
            />
            {song.isPlaying && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center bg-black/40"
              >
                <div className="w-4 h-4 rounded-full bg-white/20 border-2 border-white" />
              </motion.div>
            )}
          </motion.div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-foreground truncate">
              {song.songUrl ? (
                <a
                  href={song.songUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {song.title}
                </a>
              ) : (
                song.title
              )}
            </h4>
            <p className="text-sm text-muted-foreground truncate">
              {song.artist}
            </p>
          </div>
        </div>

        {/* Controls (visual only) */}
        {song.isPlaying && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipForward className="w-4 h-4 rotate-180" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-neon-green text-black"
            >
              {song.isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
