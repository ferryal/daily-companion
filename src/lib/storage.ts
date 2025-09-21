// Local storage utilities for Daily Companion
import { Message, UserStats, DailyChallenge } from "./types";

const STORAGE_KEYS = {
  MESSAGES: "daily-companion-messages",
  USER_STATS: "daily-companion-stats",
  DAILY_CHALLENGE: "daily-companion-challenge",
  API_KEY: "daily-companion-api-key",
  API_KEY_PROMPTED: "daily-companion-api-key-prompted",
};

// Default user stats
const DEFAULT_USER_STATS: UserStats = {
  currentStreak: 0,
  totalMessages: 0,
  xp: 0,
  level: 1,
  lastActiveDate: "",
  achievements: [],
};

// Messages management
export function getMessages(): Message[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!stored) return [];

    const messages = JSON.parse(stored);
    return messages.map(
      (msg: {
        id: string;
        content: string;
        role: string;
        timestamp: string;
        reactions?: string[];
      }) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })
    );
  } catch (error) {
    console.error("Error loading messages:", error);
    return [];
  }
}

export function saveMessages(messages: Message[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving messages:", error);
  }
}

export function addMessage(
  message: Omit<Message, "id" | "timestamp">
): Message {
  const newMessage: Message = {
    ...message,
    id: Date.now().toString(),
    timestamp: new Date(),
  };

  const messages = getMessages();
  messages.push(newMessage);
  saveMessages(messages);

  return newMessage;
}

// User stats management
export function getUserStats(): UserStats {
  if (typeof window === "undefined") return DEFAULT_USER_STATS;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_STATS);
    if (!stored) return DEFAULT_USER_STATS;

    const stats = JSON.parse(stored);
    return {
      ...DEFAULT_USER_STATS,
      ...stats,
      achievements:
        stats.achievements?.map(
          (achievement: {
            id: string;
            title: string;
            description: string;
            icon: string;
            category: string;
            unlockedAt: string;
          }) => ({
            ...achievement,
            unlockedAt: new Date(achievement.unlockedAt),
          })
        ) || [],
    };
  } catch (error) {
    console.error("Error loading user stats:", error);
    return DEFAULT_USER_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
    // Dispatch custom event to notify components of stats update
    window.dispatchEvent(new CustomEvent("statsUpdated"));
  } catch (error) {
    console.error("Error saving user stats:", error);
  }
}

export function updateStreak(): UserStats {
  const stats = getUserStats();
  const today = new Date().toDateString();
  const lastActive = new Date(stats.lastActiveDate || 0).toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

  let newStreak = stats.currentStreak;

  if (lastActive === today) {
    // Already active today, no change
  } else if (lastActive === yesterday) {
    // Continuing streak
    newStreak = stats.currentStreak + 1;
  } else {
    // Streak broken or starting new
    newStreak = 1;
  }

  const updatedStats = {
    ...stats,
    currentStreak: newStreak,
    lastActiveDate: today,
  };

  saveUserStats(updatedStats);
  return updatedStats;
}

export function addXP(amount: number): UserStats {
  const stats = getUserStats();
  const newXP = stats.xp + amount;
  const newLevel = Math.floor(newXP / 100) + 1; // 100 XP per level

  const updatedStats = {
    ...stats,
    xp: newXP,
    level: newLevel,
    totalMessages: stats.totalMessages + 1,
  };

  saveUserStats(updatedStats);
  return updatedStats;
}

// Daily challenge management
export function getDailyChallenge(): DailyChallenge | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGE);
    if (!stored) return generateDailyChallenge();

    const challenge = JSON.parse(stored);
    const today = new Date().toDateString();

    // Check if challenge is for today
    if (challenge.date !== today) {
      return generateDailyChallenge();
    }

    return challenge;
  } catch (error) {
    console.error("Error loading daily challenge:", error);
    return generateDailyChallenge();
  }
}

export function completeDailyChallenge(): DailyChallenge | null {
  const challenge = getDailyChallenge();
  if (!challenge || challenge.completed) return challenge;

  const completedChallenge = {
    ...challenge,
    completed: true,
  };

  localStorage.setItem(
    STORAGE_KEYS.DAILY_CHALLENGE,
    JSON.stringify(completedChallenge)
  );

  // Add XP for completing challenge
  addXP(completedChallenge.xpReward);

  return completedChallenge;
}

function generateDailyChallenge(): DailyChallenge {
  const challenges = [
    {
      title: "Share Gratitude",
      description: "Tell me one thing you're grateful for today",
      xpReward: 50,
    },
    {
      title: "Positive Affirmation",
      description: "Give yourself a genuine compliment",
      xpReward: 40,
    },
    {
      title: "Mood Check",
      description: "Describe how you're feeling in 3 words",
      xpReward: 30,
    },
    {
      title: "Future Vision",
      description: "Share one thing you're looking forward to",
      xpReward: 45,
    },
    {
      title: "Kind Gesture",
      description: "Tell me about something nice you did for someone",
      xpReward: 60,
    },
  ];

  const randomChallenge =
    challenges[Math.floor(Math.random() * challenges.length)];
  const today = new Date().toDateString();

  const dailyChallenge: DailyChallenge = {
    id: `challenge-${today}`,
    title: randomChallenge.title,
    description: randomChallenge.description,
    xpReward: randomChallenge.xpReward,
    completed: false,
    date: today,
  };

  localStorage.setItem(
    STORAGE_KEYS.DAILY_CHALLENGE,
    JSON.stringify(dailyChallenge)
  );
  return dailyChallenge;
}

// API Key management
export function getApiKey(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(STORAGE_KEYS.API_KEY);
  } catch (error) {
    console.error("Error loading API key:", error);
    return null;
  }
}

export function saveApiKey(apiKey: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
    // Dispatch custom event to notify components of API key update
    window.dispatchEvent(new CustomEvent("apiKeyUpdated", { detail: apiKey }));
  } catch (error) {
    console.error("Error saving API key:", error);
  }
}

export function clearApiKey(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
    // Dispatch custom event to notify components of API key removal
    window.dispatchEvent(new CustomEvent("apiKeyCleared"));
  } catch (error) {
    console.error("Error clearing API key:", error);
  }
}

// API Key prompt tracking
export function hasBeenPromptedForApiKey(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return localStorage.getItem(STORAGE_KEYS.API_KEY_PROMPTED) === "true";
  } catch (error) {
    console.error("Error checking API key prompt status:", error);
    return false;
  }
}

export function setApiKeyPrompted(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.API_KEY_PROMPTED, "true");
  } catch (error) {
    console.error("Error setting API key prompted flag:", error);
  }
}

export function clearApiKeyPrompted(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.API_KEY_PROMPTED);
  } catch (error) {
    console.error("Error clearing API key prompted flag:", error);
  }
}
