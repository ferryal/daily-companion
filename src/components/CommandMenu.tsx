"use client";

import { useEffect, useState, memo, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CommandOption {
  command: string;
  description: string;
  icon: string;
  category: string;
}

const commands: CommandOption[] = [
  {
    command: "/mood",
    description: "Check in on your feelings and mood",
    icon: "🌈",
    category: "Reflection",
  },
  {
    command: "/journal",
    description: "Guided reflection and gratitude",
    icon: "📝",
    category: "Reflection",
  },
  {
    command: "/dance",
    description: "Party time! Let's boogie",
    icon: "💃",
    category: "Fun",
  },
  {
    command: "/fortune",
    description: "Get daily wisdom and fortune",
    icon: "🔮",
    category: "Fun",
  },
  {
    command: "/magic",
    description: "Cast a motivational spell",
    icon: "✨",
    category: "Fun",
  },
  {
    command: "/rocket",
    description: "Blast off mode - get energized",
    icon: "🚀",
    category: "Motivation",
  },
  {
    command: "/zen",
    description: "Find your inner peace",
    icon: "🧘‍♀️",
    category: "Mindfulness",
  },
  {
    command: "/superhero",
    description: "Unlock your inner powers",
    icon: "🦸‍♀️",
    category: "Motivation",
  },
  {
    command: "/party",
    description: "Celebration time with confetti",
    icon: "🎉",
    category: "Fun",
  },
  {
    command: "/help",
    description: "Show all available commands",
    icon: "🎮",
    category: "Help",
  },
];

interface CommandMenuProps {
  isVisible: boolean;
  searchTerm: string;
  onSelectCommand: (command: string) => void;
  onClose: () => void;
}

export const CommandMenu = memo(function CommandMenu({
  isVisible,
  searchTerm,
  onSelectCommand,
  onClose,
}: CommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Memoize filtered commands for performance
  const filteredCommands = useMemo(() => {
    if (!searchTerm) return commands;
    const lowerTerm = searchTerm.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.command.toLowerCase().includes(lowerTerm) ||
        cmd.description.toLowerCase().includes(lowerTerm)
    );
  }, [searchTerm]);

  // Memoize grouped commands for performance
  const groupedCommands = useMemo(() => {
    return filteredCommands.reduce((groups, command) => {
      const category = command.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(command);
      return groups;
    }, {} as Record<string, CommandOption[]>);
  }, [filteredCommands]);

  // Memoize keyboard handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isVisible) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            onSelectCommand(filteredCommands[selectedIndex].command);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [isVisible, selectedIndex, filteredCommands, onSelectCommand, onClose]
  );

  // Handle keyboard navigation
  useEffect(() => {
    if (!isVisible) return;

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, handleKeyDown]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  if (!isVisible || filteredCommands.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="absolute bottom-full left-0 right-0 mb-2 z-50"
      >
        <div className="bg-background/95 backdrop-blur-lg border border-border/50 rounded-2xl shadow-xl max-h-80 overflow-hidden">
          <Command className="bg-transparent">
            <CommandList className="max-h-80">
              {Object.entries(groupedCommands).map(
                ([category, categoryCommands]) => (
                  <CommandGroup
                    key={category}
                    heading={category}
                    className="px-3 py-2"
                  >
                    {categoryCommands.map((command) => {
                      const globalIndex = filteredCommands.indexOf(command);
                      return (
                        <CommandItem
                          key={command.command}
                          value={command.command}
                          onSelect={() => onSelectCommand(command.command)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-150",
                            globalIndex === selectedIndex
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted/50"
                          )}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-lg flex-shrink-0">
                              {command.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm">
                                {command.command}
                              </div>
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {command.description}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-xs px-2 py-1 bg-muted/50 text-muted-foreground"
                          >
                            {category}
                          </Badge>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                )
              )}

              {filteredCommands.length === 0 && (
                <CommandEmpty className="py-6 text-center text-muted-foreground">
                  No commands found.
                </CommandEmpty>
              )}
            </CommandList>
          </Command>

          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-border/20 bg-muted/20">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

export default CommandMenu;
