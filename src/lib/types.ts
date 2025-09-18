// Core types for the Daily Companion app
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  reactions?: string[];
}

export interface UserStats {
  currentStreak: number;
  totalMessages: number;
  xp: number;
  level: number;
  lastActiveDate: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: "streak" | "messages" | "engagement" | "special";
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  date: string;
}

export interface QuickReply {
  id: string;
  text: string;
  icon?: string;
}
