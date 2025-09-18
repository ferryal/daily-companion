"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Achievement } from "@/lib/types";

interface AchievementModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementModal({
  achievement,
  onClose,
}: AchievementModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (achievement) {
      setShowConfetti(true);
      // Stop confetti after 3 seconds
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateSize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      updateSize();
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
  }, []);

  if (!achievement) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "streak":
        return "from-orange-500 to-red-500";
      case "messages":
        return "from-blue-500 to-purple-500";
      case "engagement":
        return "from-green-500 to-teal-500";
      case "special":
        return "from-pink-500 to-violet-500";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  return (
    <>
      {/* Confetti Effect */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
          colors={[
            "#FF6B6B",
            "#4ECDC4",
            "#45B7D1",
            "#96CEB4",
            "#FFEAA7",
            "#DDA0DD",
          ]}
        />
      )}

      <Dialog open={!!achievement} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-center space-y-4 sm:space-y-6 p-4 sm:p-6"
          >
            {/* Achievement Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.5,
                type: "spring",
                stiffness: 200,
              }}
              className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${getCategoryColor(
                achievement.category
              )} text-white text-3xl sm:text-4xl shadow-lg`}
            >
              {achievement.icon}
            </motion.div>

            {/* Achievement Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-2">
                Achievement Unlocked!
              </h2>
              <h3 className="text-lg sm:text-xl font-semibold text-primary">
                {achievement.title}
              </h3>
            </motion.div>

            {/* Achievement Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="text-muted-foreground text-base"
            >
              {achievement.description}
            </motion.p>

            {/* Category Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <Badge
                className={`bg-gradient-to-r ${getCategoryColor(
                  achievement.category
                )} text-white border-0 px-3 py-1 text-sm font-medium`}
              >
                {achievement.category.charAt(0).toUpperCase() +
                  achievement.category.slice(1)}
              </Badge>
            </motion.div>

            {/* Unlocked Date */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="text-xs text-muted-foreground"
            >
              Unlocked on {achievement.unlockedAt.toLocaleDateString()}
            </motion.p>

            {/* Close Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            >
              <Button onClick={onClose} className="w-full mt-4" size="lg">
                Awesome! 🎉
              </Button>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
}
