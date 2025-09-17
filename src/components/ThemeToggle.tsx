"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "light" | "dark" | "auto";
type ColorMood = "default" | "warm" | "cool" | "energetic" | "calm";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("auto");
  const [colorMood, setColorMood] = useState<ColorMood>("default");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Load saved theme and color mood
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedColorMood = localStorage.getItem("colorMood") as ColorMood;

    if (savedTheme) setTheme(savedTheme);
    if (savedColorMood) setColorMood(savedColorMood);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Apply theme
    if (theme === "auto") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.setAttribute("data-theme", systemTheme);
    } else {
      root.setAttribute("data-theme", theme);
    }

    // Apply color mood
    root.setAttribute("data-color-mood", colorMood);

    // Save to localStorage
    localStorage.setItem("theme", theme);
    localStorage.setItem("colorMood", colorMood);
  }, [theme, colorMood, mounted]);

  if (!mounted) return null;

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Palette className="h-4 w-4" />;
    }
  };

  const getMoodColor = (mood: ColorMood) => {
    switch (mood) {
      case "warm":
        return "bg-orange-500/20 text-orange-600";
      case "cool":
        return "bg-blue-500/20 text-blue-600";
      case "energetic":
        return "bg-red-500/20 text-red-600";
      case "calm":
        return "bg-green-500/20 text-green-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Theme Toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              {getThemeIcon()}
            </motion.div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" />
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("auto")}>
            <Palette className="mr-2 h-4 w-4" />
            Auto
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Color Mood Toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Badge
            variant="outline"
            className={`cursor-pointer transition-colors text-xs px-2 py-1 ${getMoodColor(
              colorMood
            )}`}
          >
            <span className="hidden sm:inline">{colorMood}</span>
            <span className="sm:hidden">🎨</span>
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setColorMood("default")}>
            <div className="mr-2 h-3 w-3 rounded-full bg-muted" />
            Default
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setColorMood("warm")}>
            <div className="mr-2 h-3 w-3 rounded-full bg-orange-500" />
            Warm
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setColorMood("cool")}>
            <div className="mr-2 h-3 w-3 rounded-full bg-blue-500" />
            Cool
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setColorMood("energetic")}>
            <div className="mr-2 h-3 w-3 rounded-full bg-red-500" />
            Energetic
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setColorMood("calm")}>
            <div className="mr-2 h-3 w-3 rounded-full bg-green-500" />
            Calm
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
