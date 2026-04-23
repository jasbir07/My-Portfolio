"use client";

import { motion } from "framer-motion";
import { Users, Eye, TrendingUp } from "lucide-react";

interface VisitorCounterProps {
  totalVisitors: number;
  todayVisitors: number;
  trend: number;
}

export function VisitorCounter({ totalVisitors, todayVisitors, trend }: VisitorCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-neon-cyan" />
        </div>
        <h3 className="font-mono text-lg font-bold text-foreground">
          Visitors
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Total Visitors */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Eye className="w-4 h-4" />
            <span>Total</span>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold font-mono text-foreground"
          >
            {totalVisitors.toLocaleString()}
          </motion.p>
        </div>

        {/* Today */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold font-mono text-foreground"
            >
              {todayVisitors}
            </motion.p>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                trend >= 0
                  ? "text-neon-green bg-neon-green/10"
                  : "text-destructive bg-destructive/10"
              }`}
            >
              {trend >= 0 ? "+" : ""}
              {trend}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
