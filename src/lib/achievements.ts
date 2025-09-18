// Achievement system for Daily Companion
import { Achievement, UserStats } from "./types";
import { getUserStats, saveUserStats } from "./storage";

export const achievementDefinitions = {
  // Streak achievements
  streak_3: {
    id: "streak_3",
    title: "Getting Started",
    description: "Chat for 3 days in a row",
    icon: "🔥",
    category: "streak" as const,
    check: (stats: UserStats) => stats.currentStreak >= 3,
  },
  streak_7: {
    id: "streak_7",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "⚡",
    category: "streak" as const,
    check: (stats: UserStats) => stats.currentStreak >= 7,
  },
  streak_30: {
    id: "streak_30",
    title: "Monthly Master",
    description: "Incredible 30-day streak!",
    icon: "👑",
    category: "streak" as const,
    check: (stats: UserStats) => stats.currentStreak >= 30,
  },

  // Message achievements
  messages_10: {
    id: "messages_10",
    title: "Chatterbox",
    description: "Send 10 messages",
    icon: "💬",
    category: "messages" as const,
    check: (stats: UserStats) => stats.totalMessages >= 10,
  },
  messages_50: {
    id: "messages_50",
    title: "Conversationalist",
    description: "Send 50 messages",
    icon: "🗣️",
    category: "messages" as const,
    check: (stats: UserStats) => stats.totalMessages >= 50,
  },
  messages_100: {
    id: "messages_100",
    title: "Chat Master",
    description: "Send 100 messages",
    icon: "🎯",
    category: "messages" as const,
    check: (stats: UserStats) => stats.totalMessages >= 100,
  },

  // Level achievements
  level_5: {
    id: "level_5",
    title: "Rising Star",
    description: "Reach level 5",
    icon: "⭐",
    category: "engagement" as const,
    check: (stats: UserStats) => stats.level >= 5,
  },
  level_10: {
    id: "level_10",
    title: "Elite Companion",
    description: "Reach level 10",
    icon: "🌟",
    category: "engagement" as const,
    check: (stats: UserStats) => stats.level >= 10,
  },

  // Special achievements
  first_chat: {
    id: "first_chat",
    title: "Welcome!",
    description: "Send your first message",
    icon: "👋",
    category: "special" as const,
    check: (stats: UserStats) => stats.totalMessages >= 1,
  },
  night_owl: {
    id: "night_owl",
    title: "Night Owl",
    description: "Chat after midnight",
    icon: "🦉",
    category: "special" as const,
    check: () => {
      const hour = new Date().getHours();
      return hour >= 0 && hour < 6;
    },
  },
  early_bird: {
    id: "early_bird",
    title: "Early Bird",
    description: "Chat before 6 AM",
    icon: "🐦",
    category: "special" as const,
    check: () => {
      const hour = new Date().getHours();
      return hour >= 5 && hour < 8;
    },
  },
};

export function checkForNewAchievements(): Achievement[] {
  const stats = getUserStats();
  const currentAchievementIds = stats.achievements.map((a) => a.id);
  const newAchievements: Achievement[] = [];

  // Check each achievement definition
  Object.values(achievementDefinitions).forEach((definition) => {
    // Skip if already unlocked
    if (currentAchievementIds.includes(definition.id)) return;

    // Check if achievement condition is met
    if (definition.check(stats)) {
      const newAchievement: Achievement = {
        id: definition.id,
        title: definition.title,
        description: definition.description,
        icon: definition.icon,
        category: definition.category,
        unlockedAt: new Date(),
      };

      newAchievements.push(newAchievement);
    }
  });

  // Save new achievements
  if (newAchievements.length > 0) {
    const updatedStats = {
      ...stats,
      achievements: [...stats.achievements, ...newAchievements],
    };
    saveUserStats(updatedStats);
  }

  return newAchievements;
}

export function getAchievementProgress(): Record<string, number> {
  const stats = getUserStats();
  const progress: Record<string, number> = {};

  // Calculate progress for each achievement
  progress.streak_3 = Math.min(stats.currentStreak / 3, 1);
  progress.streak_7 = Math.min(stats.currentStreak / 7, 1);
  progress.streak_30 = Math.min(stats.currentStreak / 30, 1);

  progress.messages_10 = Math.min(stats.totalMessages / 10, 1);
  progress.messages_50 = Math.min(stats.totalMessages / 50, 1);
  progress.messages_100 = Math.min(stats.totalMessages / 100, 1);

  progress.level_5 = Math.min(stats.level / 5, 1);
  progress.level_10 = Math.min(stats.level / 10, 1);

  return progress;
}
