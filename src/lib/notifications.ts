// Enhanced notification system for Daily Companion
import { toast } from "sonner";

export function showLevelUpNotification(newLevel: number, xpGained: number) {
  toast.success(`🎉 Level Up!`, {
    description: `You've reached level ${newLevel}! (+${xpGained} XP)`,
    duration: 5000,
    className: "font-medium",
    style: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      color: "white",
      border: "none",
      borderRadius: "16px",
      padding: "16px",
      boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)",
    },
    action: {
      label: "🎯 Awesome!",
      onClick: () => console.log("Level up acknowledged"),
    },
  });
}

export function showXPGainedNotification(xpGained: number) {
  if (xpGained > 0) {
    toast(`⚡ +${xpGained} XP!`, {
      duration: 2500,
      className: "font-semibold",
      style: {
        background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        color: "white",
        border: "none",
        borderRadius: "12px",
        padding: "12px 16px",
        boxShadow: "0 8px 20px rgba(59, 130, 246, 0.25)",
        fontSize: "14px",
      },
    });
  }
}

export function showStreakNotification(streakCount: number) {
  if (streakCount === 1) {
    toast.success("🔥 Streak Started!", {
      description: "Great job starting your daily habit!",
      duration: 3500,
      className: "font-medium",
      style: {
        background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
        color: "white",
        border: "none",
        borderRadius: "14px",
        padding: "14px",
        boxShadow: "0 8px 20px rgba(249, 115, 22, 0.3)",
      },
    });
  } else if (streakCount % 7 === 0) {
    toast.success(`🔥 ${streakCount} Day Streak!`, {
      description: "You're on fire! Amazing consistency!",
      duration: 4500,
      className: "font-bold",
      style: {
        background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
        color: "white",
        border: "none",
        borderRadius: "16px",
        padding: "16px",
        boxShadow: "0 12px 30px rgba(220, 38, 38, 0.4)",
      },
    });
  } else if (streakCount >= 3) {
    toast(`🔥 ${streakCount} Day Streak!`, {
      description: "Keep up the momentum!",
      duration: 3000,
      className: "font-medium",
      style: {
        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        color: "white",
        border: "none",
        borderRadius: "12px",
        padding: "12px 16px",
        boxShadow: "0 6px 15px rgba(245, 158, 11, 0.25)",
      },
    });
  }
}

export function showChallengeCompletedNotification(xpReward: number) {
  toast.success("🎯 Challenge Complete!", {
    description: `You earned ${xpReward} XP! Great work!`,
    duration: 4500,
    className: "font-medium",
    style: {
      background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      color: "white",
      border: "none",
      borderRadius: "16px",
      padding: "16px",
      boxShadow: "0 10px 25px rgba(139, 92, 246, 0.35)",
    },
    action: {
      label: "🎉 Awesome!",
      onClick: () => console.log("Challenge completion acknowledged"),
    },
  });
}

export function showWelcomeNotification() {
  toast("👋 Welcome to Daily Companion!", {
    description: "Start chatting to build your streak and earn XP!",
    duration: 6000,
    className: "font-medium",
    style: {
      background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
      color: "white",
      border: "none",
      borderRadius: "16px",
      padding: "16px",
      boxShadow: "0 10px 25px rgba(99, 102, 241, 0.3)",
    },
  });
}
