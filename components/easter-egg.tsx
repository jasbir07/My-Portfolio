"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";

// Konami code: up up down down left right left right b a
const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

export function EasterEgg() {
  const [isTriggered, setIsTriggered] = useState(false);
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const newSequence = [...inputSequence, e.code].slice(-KONAMI_CODE.length);
      setInputSequence(newSequence);

      if (newSequence.join(",") === KONAMI_CODE.join(",")) {
        setIsTriggered(true);
        setShowConfetti(true);
        setInputSequence([]);
        
        // Auto-hide confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000);
      }
    },
    [inputSequence]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Confetti particles */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: Math.random() * 720 - 360,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  delay: Math.random() * 0.5,
                  ease: "linear",
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: [
                    "var(--neon-purple)",
                    "var(--neon-blue)",
                    "var(--neon-cyan)",
                    "var(--neon-green)",
                    "#fbbf24",
                    "#ec4899",
                  ][Math.floor(Math.random() * 6)],
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Easter egg modal */}
      <AnimatePresence>
        {isTriggered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsTriggered(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
            >
              {/* Background glow */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-60 bg-primary/50 rounded-full blur-3xl" />
              </div>

              <button
                onClick={() => setIsTriggered(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10 space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary via-accent to-neon-cyan flex items-center justify-center neon-glow"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>

                <h2 className="text-2xl font-bold text-foreground neon-text">
                  You found the secret!
                </h2>

                <p className="text-muted-foreground">
                  You discovered the Konami code easter egg. You&apos;re clearly a
                  developer who knows the classics.
                </p>

                <div className="pt-4 space-y-2">
                  <p className="text-xs text-muted-foreground font-mono">
                    Achievement Unlocked
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/30">
                    <span className="font-mono text-sm">Code Master</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsTriggered(false)}
                  className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
                >
                  Awesome!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
