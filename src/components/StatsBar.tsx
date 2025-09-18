"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Star, Trophy, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserStats, DailyChallenge } from "@/lib/types";
import { getUserStats, getDailyChallenge } from "@/lib/storage";
import { cn } from "@/lib/utils";

export function StatsBar() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(
    null
  );
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const loadedStats = getUserStats();
    const loadedChallenge = getDailyChallenge();
    setStats(loadedStats);
    setDailyChallenge(loadedChallenge);

    // Listen for storage changes to update immediately
    const handleStorageChange = () => {
      const newStats = getUserStats();
      const newChallenge = getDailyChallenge();
      setStats(newStats);
      setDailyChallenge(newChallenge);
    };

    // Listen for custom storage events
    window.addEventListener("statsUpdated", handleStorageChange);

    // Update stats every 30 seconds to catch changes
    const interval = setInterval(() => {
      setStats(getUserStats());
      setDailyChallenge(getDailyChallenge());
    }, 30000);

    return () => {
      clearInterval(interval);
      window.removeEventListener("statsUpdated", handleStorageChange);
    };
  }, []);

  // Animate progress bar when stats change
  useEffect(() => {
    if (stats) {
      const targetProgress = ((stats.xp - (stats.level - 1) * 100) / 100) * 100;

      // Smooth animation with delay
      const timer = setTimeout(() => {
        setAnimatedProgress(targetProgress);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [stats]);

  if (!stats) return null;

  const currentLevelXP = stats ? stats.xp - (stats.level - 1) * 100 : 0;
  const progressPercentage = (currentLevelXP / 100) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-background/95 backdrop-blur-md border-b border-border/20 p-4 lg:p-6"
    >
      <div className="w-full">
        {/* Main Stats Row */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          {/* Left: Streak & Level */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Animated Streak */}
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{
                  scale: stats.currentStreak > 0 ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200",
                  stats.currentStreak > 0
                    ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-600 shadow-sm"
                    : "bg-muted/50 text-muted-foreground"
                )}
              >
                <motion.div
                  animate={
                    stats.currentStreak > 0
                      ? {
                          rotate: [0, -10, 10, 0],
                          scale: [1, 1.1, 1],
                        }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Flame
                    className={cn(
                      "h-3 w-3 sm:h-4 sm:w-4 transition-colors",
                      stats.currentStreak > 0 && "text-orange-500"
                    )}
                  />
                </motion.div>
                <motion.span
                  key={stats.currentStreak}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="font-bold text-xs sm:text-sm"
                >
                  {stats.currentStreak}
                </motion.span>
              </motion.div>
              <span className="text-xs text-muted-foreground hidden sm:inline font-medium">
                day streak
              </span>
            </motion.div>

            {/* Animated Level Badge */}
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/20 shadow-sm cursor-pointer"
                whileHover={{
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
                  borderColor: "rgba(59, 130, 246, 0.3)",
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                </motion.div>
                <motion.span
                  key={stats.level}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="font-bold text-xs sm:text-sm text-blue-600"
                >
                  <span className="hidden sm:inline">Level </span>
                  {stats.level}
                </motion.span>
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Stats */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
            <motion.div
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
              <motion.span
                key={stats.totalMessages}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="font-medium text-foreground"
              >
                <span className="hidden sm:inline">{stats.totalMessages}</span>
                <span className="sm:hidden">
                  {stats.totalMessages > 99 ? "99+" : stats.totalMessages}
                </span>
              </motion.span>
            </motion.div>

            <motion.div
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              <motion.span
                key={stats.xp}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="font-medium text-foreground"
              >
                <span className="hidden sm:inline">{stats.xp} XP</span>
                <span className="sm:hidden">
                  {stats.xp > 999 ? "999+" : stats.xp}
                </span>
              </motion.span>
            </motion.div>
          </div>
        </div>

        {/* Animated XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Level {stats.level}</span>
              <span className="sm:hidden">Lvl {stats.level}</span>
              <motion.span
                key={currentLevelXP}
                initial={{ scale: 1.2, color: "rgb(34 197 94)" }}
                animate={{ scale: 1, color: "rgb(113 113 122)" }}
                transition={{ duration: 0.3 }}
                className="font-medium"
              >
                +{currentLevelXP} XP
              </motion.span>
            </div>
            <span className="hidden sm:inline">{currentLevelXP}/100 XP</span>
            <span className="sm:hidden">{currentLevelXP}/100</span>
          </div>

          {/* Custom Animated Progress Bar */}
          <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${animatedProgress}%` }}
              transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.2,
              }}
            />

            {/* Shimmer effect */}
            <motion.div
              className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "400%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "linear",
              }}
            />

            {/* Pulse effect at current position */}
            {animatedProgress > 0 && (
              <motion.div
                className="absolute top-0 h-full w-1 bg-white/40 rounded-full"
                style={{ left: `${animatedProgress}%` }}
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </div>

          {/* Level up indicator */}
          {progressPercentage >= 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="text-center"
            >
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                ✨ Ready to level up!
              </span>
            </motion.div>
          )}
        </div>

        {/* Daily Challenge */}
        {dailyChallenge && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-2 sm:mt-3 p-2.5 sm:p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-xs sm:text-sm text-purple-600 dark:text-purple-400">
                  📋{" "}
                  <span className="hidden sm:inline">
                    Today&apos;s Challenge
                  </span>
                  <span className="sm:hidden">Challenge</span>
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {dailyChallenge.description}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge
                  variant={dailyChallenge.completed ? "default" : "outline"}
                  className={cn(
                    "text-xs",
                    dailyChallenge.completed
                      ? "bg-green-500/20 text-green-600 border-green-500/20"
                      : "border-purple-500/20 text-purple-600"
                  )}
                >
                  {dailyChallenge.completed
                    ? "✓"
                    : `+${dailyChallenge.xpReward}`}
                </Badge>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
