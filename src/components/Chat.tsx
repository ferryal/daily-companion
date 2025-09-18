"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedInput } from "@/components/OptimizedInput";
import { ChatMessage } from "@/components/ChatMessage";
import { QuickReply } from "@/components/QuickReply";

// Lazy load heavy components for better performance
const AchievementModal = lazy(() => import("@/components/AchievementModal"));
const ParticleBackground = lazy(
  () => import("@/components/ParticleBackground")
);
const CommandMenu = lazy(() => import("@/components/CommandMenu"));
import {
  Message,
  QuickReply as QuickReplyType,
  Achievement,
} from "@/lib/types";
import { aiService } from "@/lib/ai";
import { ModelSelector } from "@/components/ModelSelector";
import {
  getMessages,
  addMessage,
  updateStreak,
  addXP,
  getUserStats,
} from "@/lib/storage";
import { checkForNewAchievements } from "@/lib/achievements";
import {
  showLevelUpNotification,
  showXPGainedNotification,
  showStreakNotification,
} from "@/lib/notifications";
import { useChatSounds, useHaptics } from "@/lib/sounds";
import { cn } from "@/lib/utils";

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState<QuickReplyType[]>([]);
  const [currentAchievement, setCurrentAchievement] =
    useState<Achievement | null>(null);
  const [particleMood, setParticleMood] = useState<
    "calm" | "energetic" | "focused" | "celebratory"
  >("calm");
  const [particleIntensity, setParticleIntensity] = useState(0.3);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sound and haptic hooks
  const sounds = useChatSounds();
  const haptics = useHaptics();

  // Load messages on mount
  useEffect(() => {
    const loadedMessages = getMessages();
    setMessages(loadedMessages);

    // Show welcome message if no messages
    if (loadedMessages.length === 0) {
      const welcomeMessage = addMessage({
        content:
          "Hey there! 👋 Welcome to Daily Companion! I'm here to chat, encourage, and help you build positive daily habits. What's on your mind today?",
        role: "assistant",
      });
      setMessages([welcomeMessage]);
      generateQuickReplies();
    } else {
      // Generate quick replies for the last message if it's from assistant
      const lastMessage = loadedMessages[loadedMessages.length - 1];
      if (lastMessage.role === "assistant") {
        generateQuickReplies();
      }
    }
  }, []);

  // Auto scroll to bottom when new messages arrive with optimized scrolling
  useEffect(() => {
    if (scrollAreaRef.current) {
      requestAnimationFrame(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      });
    }
  }, [messages]);

  // Debounce input value for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 100);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Debounced command menu visibility with useMemo for performance
  const shouldShowMenu = useMemo(
    () => inputValue.startsWith("/"),
    [inputValue]
  );

  useEffect(() => {
    setShowCommandMenu(shouldShowMenu);
  }, [shouldShowMenu]);

  const getReplyIcon = (reply: string): string => {
    const text = reply.toLowerCase();
    if (text.includes("thank") || text.includes("great")) return "🙏";
    if (text.includes("more") || text.includes("tell")) return "💭";
    if (text.includes("yes") || text.includes("sure")) return "✅";
    if (text.includes("no") || text.includes("not")) return "❌";
    if (text.includes("help") || text.includes("how")) return "🤔";
    if (text.includes("try") || text.includes("start")) return "🚀";
    if (text.includes("agree") || text.includes("good")) return "👍";
    return "💬";
  };

  const generateQuickReplies = () => {
    const replies: QuickReplyType[] = [
      { id: "1", text: "Tell me more", icon: "💭" },
      { id: "2", text: "I'm feeling great!", icon: "😊" },
      { id: "3", text: "What should I do today?", icon: "🎯" },
      { id: "4", text: "Share a fun fact", icon: "✨" },
      { id: "5", text: "Help me stay motivated", icon: "💪" },
    ];
    setQuickReplies(replies);
  };

  const handleSendMessage = useCallback(
    async (messageContent?: string) => {
      const content = messageContent || inputValue.trim();
      if (!content || isLoading) return;

      // Clear input and play send sound
      setInputValue("");
      setQuickReplies([]);
      sounds.playMessageSent();
      haptics.light();

      // Add user message
      const userMessage = addMessage({
        content,
        role: "user",
      });
      setMessages((prev) => [...prev, userMessage]);

      // Update streak and XP with notifications
      const previousStats = getUserStats();
      const updatedStats = updateStreak();
      const xpStats = addXP(10); // 10 XP per message

      // Show streak notification
      if (updatedStats.currentStreak > previousStats.currentStreak) {
        showStreakNotification(updatedStats.currentStreak);
      }

      // Show level up notification
      if (xpStats.level > previousStats.level) {
        showLevelUpNotification(xpStats.level, 10);
        sounds.playLevelUp();
        haptics.success();
        setParticleMood("celebratory");
        setParticleIntensity(0.8);
        setTimeout(() => {
          setParticleMood("calm");
          setParticleIntensity(0.3);
        }, 3000);
      } else {
        showXPGainedNotification(10);
      }

      // Check for new achievements
      const newAchievements = checkForNewAchievements();
      if (newAchievements.length > 0) {
        // Show the first new achievement (you could queue them)
        setTimeout(() => {
          setCurrentAchievement(newAchievements[0]);
          sounds.playAchievement();
          haptics.success();
          setParticleMood("celebratory");
          setParticleIntensity(1);
          setTimeout(() => {
            setParticleMood("calm");
            setParticleIntensity(0.3);
          }, 5000);
        }, 1000);
      }

      // Show loading state
      setIsLoading(true);

      try {
        // Get AI response with OpenRouter
        const response = await aiService.sendMessage(
          [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
          }))
        );

        // Add AI response
        const aiMessage = addMessage({
          content: response.content,
          role: "assistant",
        });
        setMessages((prev) => [...prev, aiMessage]);

        // Play receive sound
        sounds.playMessageReceived();
        haptics.light();

        // Use AI-generated quick replies if available
        if (response.quickReplies && response.quickReplies.length > 0) {
          const aiQuickReplies: QuickReplyType[] = response.quickReplies.map(
            (reply, index) => ({
              id: `ai-${index}`,
              text: reply,
              icon: getReplyIcon(reply),
            })
          );
          setQuickReplies(aiQuickReplies);
        } else {
          // Fallback to contextual quick replies
          generateQuickReplies();
        }
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage = addMessage({
          content:
            "Sorry, I'm having trouble responding right now. Please try again! 😅",
          role: "assistant",
        });
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      messages,
      inputValue,
      isLoading,
      sounds,
      haptics,
      particleMood,
      particleIntensity,
    ]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!showCommandMenu) {
          handleSendMessage();
        }
        // Command menu handles its own Enter key
      }
      if (e.key === "Escape" && showCommandMenu) {
        setShowCommandMenu(false);
        setInputValue("");
      }
    },
    [showCommandMenu, handleSendMessage]
  );

  const handleCommandSelect = useCallback(
    (command: string) => {
      setInputValue(command);
      setShowCommandMenu(false);
      handleSendMessage(command);
    },
    [handleSendMessage]
  );

  const handleReaction = useCallback(
    (messageId: string, reaction: string) => {
      const updatedMessages = messages.map((msg) => {
        if (msg.id === messageId) {
          const currentReactions = msg.reactions || [];
          const hasReaction = currentReactions.includes(reaction);

          if (!hasReaction) {
            sounds.playReaction();
            haptics.light();
          }

          return {
            ...msg,
            reactions: hasReaction
              ? currentReactions.filter((r) => r !== reaction)
              : [...currentReactions, reaction],
          };
        }
        return msg;
      });

      setMessages(updatedMessages);
      // Save updated messages to localStorage
      import("@/lib/storage").then(({ saveMessages }) => {
        saveMessages(updatedMessages);
      });
    },
    [messages, sounds, haptics]
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/20 relative">
      {/* Particle Background */}
      <Suspense fallback={null}>
        <ParticleBackground mood={particleMood} intensity={particleIntensity} />
      </Suspense>
      {/* Chat Messages */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent mobile-scroll"
        style={{ transform: "translateZ(0)", willChange: "scroll-position" }}
      >
        <div className="space-y-1">
          <AnimatePresence>
            {messages.slice(-50).map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onReaction={handleReaction}
              />
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex gap-3 p-4"
            >
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 text-white animate-spin" />
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-muted/60 rounded-2xl px-4 py-3 max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Quick Replies */}
      <QuickReply replies={quickReplies} onReplyClick={handleSendMessage} />

      {/* Input Area */}
      <div
        className="p-3 border-t bg-background/95 backdrop-blur-md"
        style={{ contain: "layout style" }}
      >
        <div className="relative">
          {/* AI Model Selector */}
          <div className="flex justify-start items-center mb-2">
            <ModelSelector />
          </div>

          {/* Command Menu */}
          <Suspense fallback={null}>
            <CommandMenu
              isVisible={showCommandMenu}
              searchTerm={inputValue.length > 1 ? inputValue.slice(1) : ""} // Remove the "/" only if there's more content
              onSelectCommand={handleCommandSelect}
              onClose={() => setShowCommandMenu(false)}
            />
          </Suspense>

          <div className="flex gap-2 items-end" style={{ contain: "layout" }}>
            <div className="flex-1 relative">
              <OptimizedInput
                ref={inputRef}
                value={inputValue}
                onChange={useCallback(
                  (e: React.ChangeEvent<HTMLInputElement>) => {
                    setInputValue(e.target.value);
                  },
                  []
                )}
                onKeyPress={handleKeyPress}
                placeholder="Message... (type / for commands)"
                disabled={isLoading}
                className="resize-none border-2 border-border/50 bg-background rounded-xl px-3 py-2 text-sm focus:border-primary transition-all min-h-[40px] pr-12"
              />
              {inputValue.startsWith("/") && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <span className="bg-primary/15 text-primary px-1.5 py-0.5 rounded-full text-xs font-medium">
                    cmd
                  </span>
                </div>
              )}
            </div>
            <Button
              onClick={() => handleSendMessage()}
              disabled={(!inputValue.trim() || isLoading) && !showCommandMenu}
              className={cn(
                "h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg",
                inputValue.trim() && !isLoading && "scale-105 shadow-xl"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
              ) : (
                <Send className="h-4 w-4 text-primary-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Achievement Modal */}
      <Suspense fallback={null}>
        <AchievementModal
          achievement={currentAchievement}
          onClose={() => setCurrentAchievement(null)}
        />
      </Suspense>
    </div>
  );
}
