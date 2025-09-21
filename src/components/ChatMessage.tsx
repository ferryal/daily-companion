"use client";

import { motion } from "framer-motion";
import { memo, useCallback } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  User,
  Copy,
  Share,
  Volume2,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useChatSounds } from "@/lib/sounds";

interface ChatMessageProps {
  message: Message;
  onReaction?: (messageId: string, reaction: string) => void;
}

const actionButtons = [
  { icon: Copy, action: "copy", tooltip: "Copy to clipboard" },
  { icon: ThumbsUp, action: "like", tooltip: "Like" },
  { icon: ThumbsDown, action: "unlike", tooltip: "Unlike" },
  { icon: Share, action: "share", tooltip: "Share" },
  { icon: Volume2, action: "read_aloud", tooltip: "Read aloud" },
];

export const ChatMessage = memo(function ChatMessage({
  message,
  onReaction,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const sounds = useChatSounds();

  const handleAction = useCallback(
    async (action: string) => {
      switch (action) {
        case "copy":
          await navigator.clipboard.writeText(message.content);
          sounds.playReaction();
          break;
        case "like":
          onReaction?.(message.id, "👍");
          sounds.playReaction();
          break;
        case "unlike":
          onReaction?.(message.id, "👎");
          sounds.playReaction();
          break;
        case "share":
          if (navigator.share) {
            await navigator.share({
              text: message.content,
              title: "Daily Companion Message",
            });
          } else {
            await navigator.clipboard.writeText(message.content);
          }
          sounds.playReaction();
          break;
        case "read_aloud":
          if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(message.content);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
            sounds.playReaction();
          }
          break;
      }
    },
    [message.content, message.id, onReaction, sounds]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex gap-2 sm:gap-3 p-3 sm:p-4 hover:bg-muted/30 transition-colors group",
        isUser && "flex-row-reverse"
      )}
      style={{ transform: "translateZ(0)" }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Avatar
            className={cn(
              "h-8 w-8 sm:h-9 sm:w-9 ring-2 transition-all duration-200",
              isUser && "ring-blue-500/30 hover:ring-blue-500/50",
              isAssistant && "ring-purple-500/30 hover:ring-purple-500/50"
            )}
          >
            <AvatarFallback
              className={cn(
                "transition-all duration-200 flex items-center justify-center",
                isUser &&
                  "bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700",
                isAssistant &&
                  "bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              )}
            >
              {isUser ? (
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </AvatarFallback>
          </Avatar>
        </motion.div>
      </div>

      {/* Message Content */}
      <div className={cn("flex-1 space-y-2", isUser && "text-right")}>
        {/* Message Bubble */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.2, ease: "easeOut" }}
          className={cn(
            "inline-block max-w-[85%] sm:max-w-[80%] px-4 py-3 text-sm leading-relaxed shadow-sm transition-all duration-200",
            isUser &&
              "bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-auto rounded-3xl rounded-br-lg hover:shadow-md",
            isAssistant &&
              "bg-gradient-to-br from-background to-muted/30 text-foreground border border-border/50 rounded-3xl rounded-bl-lg hover:border-border"
          )}
        >
          {message.content}
        </motion.div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className={cn("flex gap-1 flex-wrap", isUser && "justify-end")}>
            {message.reactions.map((reaction, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs h-6 px-2 bg-background/80 hover:bg-background cursor-pointer"
              >
                {reaction}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Buttons (show on hover for assistant messages) */}
        {isAssistant && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex gap-1 mt-2">
              {actionButtons.map(({ icon: Icon, action, tooltip }) => (
                <motion.button
                  key={action}
                  onClick={() => handleAction(action)}
                  className="hover:scale-110 transition-transform duration-200 bg-background/60 hover:bg-background/80 rounded-full w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground"
                  title={tooltip}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        <div
          className={cn(
            "text-xs text-muted-foreground",
            isUser && "text-right"
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </motion.div>
  );
});
