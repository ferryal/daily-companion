// Mock AI Responses for fallback
export const mockResponses = {
  greetings: [
    "Hey there! 👋 Ready to start your day with some positive vibes?",
    "Hello! 🌟 I'm excited to chat with you today!",
    "Hi! ✨ What's on your mind today?",
    "Good to see you! 🎉 How can I brighten your day?",
    "Welcome back! 🌈 Let's make today amazing!",
  ],

  positivity: [
    "That's such a wonderful perspective! 🌟 Keep that positive energy flowing!",
    "I love your optimism! ✨ You're radiating good vibes today!",
    "What an inspiring way to look at things! 🌈 You're amazing!",
    "Your positivity is contagious! 🎉 Thank you for sharing that!",
    "That's the spirit! 💫 Keep shining bright!",
  ],

  encouragement: [
    "You've got this! 💪 Every step forward is progress!",
    "Believe in yourself - you're capable of amazing things! ⭐",
    "Progress is progress, no matter how small! 🌱 Keep going!",
    "You're stronger than you think! 🔥 Don't give up!",
    "Every challenge is an opportunity to grow! 🚀 You're doing great!",
  ],

  reflection: [
    "That's a really thoughtful question. What do you think about it? 🤔",
    "Interesting perspective! How does that make you feel? 💭",
    "That's worth pondering. What insights come to mind? ✨",
    "Good reflection! What would you like to explore about that? 🌟",
    "I appreciate you sharing that. What's your take on it? 💫",
  ],

  streaks: [
    "🔥 Amazing streak! You're building an incredible habit!",
    "🎯 Consistency is key, and you're nailing it!",
    "⚡ Your dedication is paying off! Keep it up!",
    "🌟 Every day you show up makes a difference!",
    "🎉 You're on fire with this streak! So proud of you!",
  ],

  challenges: [
    "Here's a fun challenge: Share one thing you're grateful for today! 🙏",
    "Today's challenge: Give yourself a compliment! You deserve it! 💖",
    "Challenge time: Name one small win from this week! 🏆",
    "Here's your challenge: Describe your perfect day in 3 words! ☀️",
    "Challenge: What's one thing you're looking forward to? 🌈",
  ],

  default: [
    "That's interesting! Tell me more about what you're thinking 🤔",
    "I hear you! How can I help make your day better? ✨",
    "Thanks for sharing that with me! What would you like to explore? 💫",
    "That sounds meaningful. What's your perspective on it? 🌟",
    "I'm here to listen and chat! What's on your heart today? 💖",
  ],
};

export function getMockResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();

  // Handle slash commands
  if (message.startsWith("/")) {
    return handleSlashCommand(message);
  }

  // Greeting patterns
  if (
    message.match(/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/)
  ) {
    return getRandomResponse(mockResponses.greetings);
  }

  // Positive sentiment
  if (
    message.match(
      /\b(great|awesome|amazing|wonderful|fantastic|happy|excited|love|good)\b/
    )
  ) {
    return getRandomResponse(mockResponses.positivity);
  }

  // Need encouragement
  if (
    message.match(
      /\b(tired|sad|difficult|hard|struggle|worried|anxious|stressed)\b/
    )
  ) {
    return getRandomResponse(mockResponses.encouragement);
  }

  // Questions or reflection
  if (
    message.includes("?") ||
    message.match(/\b(think|feel|wonder|question|why|how|what)\b/)
  ) {
    return getRandomResponse(mockResponses.reflection);
  }

  // Streak related
  if (message.match(/\b(streak|daily|consistent|habit)\b/)) {
    return getRandomResponse(mockResponses.streaks);
  }

  // Challenge requests
  if (message.match(/\b(challenge|task|activity|do)\b/)) {
    return getRandomResponse(mockResponses.challenges);
  }

  // Default response
  return getRandomResponse(mockResponses.default);
}

function handleSlashCommand(command: string): string {
  const cmd = command.split(" ")[0];

  switch (cmd) {
    case "/mood":
      return "🌈 Let's check in on your mood! On a scale of 1-10, how are you feeling today? Share what's influencing your mood!";

    case "/journal":
      return "📝 Time for some reflection! What's one highlight from your day so far? What's one thing you're grateful for?";

    case "/dance":
      return "💃🕺 *AI starts dancing* 🎵 Let's boogie! Here's a fun fact: Dancing for just 10 minutes can boost your mood! Want to join me?";

    case "/fortune":
      const fortunes = [
        "🔮 Today's fortune: Your positive energy will create ripple effects of joy around you!",
        "✨ Fortune says: A small act of kindness today will lead to unexpected happiness!",
        "🌟 Your fortune: Trust your intuition - it's guiding you toward something wonderful!",
        "🎯 Fortune cookie wisdom: The best conversations happen when you're genuinely curious!",
        "💫 Today's fortune: Your smile is someone else's sunshine today!",
      ];
      return fortunes[Math.floor(Math.random() * fortunes.length)];

    case "/magic":
      return "✨🎩 *waves virtual wand* ✨ Abracadabra! You now have +50 bonus XP and unlimited motivation for today! 🌟 (The real magic was the confidence you had all along!)";

    case "/rocket":
      return "🚀 *AI transforms into rocket mode* 🚀 BLAST OFF! You're ready to tackle anything today! Remember: every expert was once a beginner! 💫⭐🌟";

    case "/party":
      return "🎉🎊 PARTY TIME! 🎊🎉 *throws virtual confetti everywhere* You deserve to celebrate! What's one thing you're proud of today? Let's party! 🥳🎈🎂";

    case "/zen":
      return "🧘‍♀️ *enters zen mode* 🧘‍♂️ Take a deep breath with me... inhale peace, exhale stress. You are exactly where you need to be right now. 🌸☮️🕯️";

    case "/superhero":
      return "🦸‍♀️ *AI dons cape* 🦸‍♂️ Your superpower today is PERSISTENCE! Every small step you take is saving the day. What challenge will you conquer next, hero? 💥⚡🔥";

    case "/help":
      return "🎮 Available commands:\n/mood - Check in on your feelings\n/journal - Guided reflection\n/dance - Let's party! 💃\n/fortune - Daily wisdom\n/magic - Cast a spell! ✨\n/rocket - Blast off mode! 🚀\n/party - Celebration time! 🎉\n/zen - Find your peace 🧘‍♀️\n/superhero - Unlock your powers! 🦸‍♀️\n\nJust type normally and I'll respond naturally! ✨";

    default:
      return "🤔 Hmm, I don't recognize that command! Try /help to see what I can do, or just chat with me normally! ✨";
  }
}

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}
