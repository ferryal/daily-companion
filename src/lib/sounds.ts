// Sound effects for Daily Companion

// For now, we'll use simple generated sounds
// In a real app, you'd want to add actual sound files to /public/sounds/

export function useChatSounds() {
  // We'll create simple audio using Web Audio API instead of files
  const playSound = (
    frequency: number,
    duration: number = 200,
    type: OscillatorType = "sine"
  ) => {
    if (typeof window === "undefined") return;

    try {
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration / 1000
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.log("Audio not available:", error);
    }
  };

  return {
    playMessageSent: () => playSound(800, 150, "sine"),
    playMessageReceived: () => playSound(600, 200, "sine"),
    playLevelUp: () => {
      // Play a sequence of ascending notes
      setTimeout(() => playSound(523, 150), 0); // C
      setTimeout(() => playSound(659, 150), 150); // E
      setTimeout(() => playSound(784, 150), 300); // G
      setTimeout(() => playSound(1047, 300), 450); // C (octave)
    },
    playAchievement: () => {
      // Play a triumphant sound
      setTimeout(() => playSound(440, 100), 0); // A
      setTimeout(() => playSound(554, 100), 100); // C#
      setTimeout(() => playSound(659, 100), 200); // E
      setTimeout(() => playSound(880, 300), 300); // A (octave)
    },
    playStreak: () => playSound(880, 250, "triangle"),
    playReaction: () => playSound(1000, 100, "sine"),
    playError: () => playSound(200, 400, "sawtooth"),
  };
}

// Haptic feedback for mobile devices
export function useHaptics() {
  const vibrate = (pattern: number | number[]) => {
    if (
      typeof window !== "undefined" &&
      "navigator" in window &&
      "vibrate" in navigator
    ) {
      navigator.vibrate(pattern);
    }
  };

  return {
    light: () => vibrate(50),
    medium: () => vibrate(100),
    heavy: () => vibrate(200),
    pattern: (pattern: number[]) => vibrate(pattern),
    success: () => vibrate([50, 50, 50]),
    error: () => vibrate([100, 50, 100]),
  };
}
