"use client";

import { motion } from "framer-motion";
import { QuickReply as QuickReplyType } from "@/lib/types";

interface QuickReplyProps {
  replies: QuickReplyType[];
  onReplyClick: (reply: string) => void;
}

export function QuickReply({ replies, onReplyClick }: QuickReplyProps) {
  if (replies.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="px-4 pb-4"
    >
      {/* Horizontal Scrolling Carousel */}
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
          {replies.map((reply, index) => (
            <motion.div
              key={reply.id}
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.2 + index * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="flex-shrink-0 snap-start"
            >
              <motion.button
                onClick={() => onReplyClick(reply.text)}
                className="flex items-center gap-2 px-4 py-2.5 bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl hover:border-primary hover:bg-primary/5 hover:shadow-md active:scale-95 transition-all duration-200 text-sm font-medium whitespace-nowrap"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {reply.icon && (
                  <span className="text-base flex-shrink-0">{reply.icon}</span>
                )}
                <span className="text-foreground">{reply.text}</span>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Fade gradient at the end to indicate more content */}
        <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}
