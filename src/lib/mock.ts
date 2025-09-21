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

  productivity: [
    "You're on the right track! 🎯 What's your next priority?",
    "Love the focus! ⚡ How can we build on this momentum?",
    "Great minds think alike! 🧠 What's your game plan?",
    "You're crushing it! 💪 What's the next milestone?",
    "That's the spirit! 🚀 Let's keep this energy going!",
    "Smart approach! 🎲 What tools are helping you most?",
  ],

  creativity: [
    "Your creativity is sparking! ✨ Tell me more about your ideas!",
    "I love where your mind is going! 🎨 What's inspiring you?",
    "That's such a unique perspective! 🌟 How did you think of that?",
    "Your imagination is amazing! 🦄 What else are you dreaming up?",
    "Creative genius at work! 🎭 What's your next masterpiece?",
    "Innovation mode activated! 💡 How can we expand on this?",
  ],

  wellness: [
    "Taking care of yourself is so important! 🌸 How are you feeling?",
    "Self-care isn't selfish - it's necessary! 💆‍♀️ What helps you recharge?",
    "Your wellbeing matters! 🌿 What brings you peace?",
    "Mind, body, and soul - you're nurturing all three! 🧘‍♀️",
    "Balance is beautiful! ⚖️ What's working well for you?",
    "You're glowing with good energy! ✨ Keep prioritizing yourself!",
  ],

  learning: [
    "Learning never stops! 📚 What's caught your curiosity lately?",
    "Knowledge is power! ⚡ What new skills are you exploring?",
    "Growth mindset in action! 🌱 What's challenging you in a good way?",
    "Every day is a school day! 🎓 What wisdom have you gained?",
    "Curiosity is your superpower! 🔍 What questions are you asking?",
    "The best investment is in yourself! 💎 What are you discovering?",
  ],

  relationships: [
    "Connection is everything! 💕 How are your relationships flourishing?",
    "People make life meaningful! 👥 Who's brought joy to your day?",
    "Love in all its forms is beautiful! 💖 What relationships are you grateful for?",
    "Community matters! 🤝 How are you building connections?",
    "Your heart is in the right place! ❤️ Who needs your kindness today?",
    "Relationships require care and attention! 🌹 How are you showing up?",
  ],

  default: [
    "That's interesting! Tell me more about what you're thinking 🤔",
    "I hear you! How can I help make your day better? ✨",
    "Thanks for sharing that with me! What would you like to explore? 💫",
    "That sounds meaningful. What's your perspective on it? 🌟",
    "I'm here to listen and chat! What's on your heart today? 💖",
    "Your thoughts matter to me! What's been on your mind? 🌙",
    "Every conversation with you is a gift! What shall we dive into? 🎁",
    "I love our chats! What adventure are we going on today? 🗺️",
    "You always bring such good energy! What's lighting you up? ⚡",
    "Life is full of possibilities! What's exciting you right now? 🌈",
    "I'm curious about your world! What story do you want to share? 📖",
    "Your perspective is unique and valuable! What's your take? 🎯",
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

  // Productivity and work
  if (message.match(/\b(work|productive|focus|goal|plan|organize|task)\b/)) {
    return getRandomResponse(mockResponses.productivity);
  }

  // Creativity and ideas
  if (
    message.match(/\b(create|creative|idea|design|art|music|write|imagine)\b/)
  ) {
    return getRandomResponse(mockResponses.creativity);
  }

  // Wellness and self-care
  if (
    message.match(
      /\b(health|wellness|exercise|sleep|relax|meditation|mindful)\b/
    )
  ) {
    return getRandomResponse(mockResponses.wellness);
  }

  // Learning and growth
  if (
    message.match(/\b(learn|study|book|skill|knowledge|grow|improve|course)\b/)
  ) {
    return getRandomResponse(mockResponses.learning);
  }

  // Relationships and social
  if (
    message.match(/\b(friend|family|relationship|love|connect|social|people)\b/)
  ) {
    return getRandomResponse(mockResponses.relationships);
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

    case "/inspire":
      const inspirations = [
        "🌟 Remember: You are braver than you believe, stronger than you seem, and smarter than you think!",
        "✨ Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown!",
        "🚀 The only impossible journey is the one you never begin. Your time is now!",
        "💎 You are not just a drop in the ocean, but the entire ocean in each drop!",
        "🌱 Growth begins at the end of your comfort zone. You're ready for this!",
      ];
      return inspirations[Math.floor(Math.random() * inspirations.length)];

    case "/quote":
      const quotes = [
        "💭 'The way to get started is to quit talking and begin doing.' - Walt Disney",
        "✨ 'Innovation distinguishes between a leader and a follower.' - Steve Jobs",
        "🌟 'Life is what happens to you while you're busy making other plans.' - John Lennon",
        "🎯 'The future belongs to those who believe in the beauty of their dreams.' - Eleanor Roosevelt",
        "💫 'It is during our darkest moments that we must focus to see the light.' - Aristotle",
      ];
      return quotes[Math.floor(Math.random() * quotes.length)];

    case "/goals":
      return "🎯 Goal setting time! What's one thing you want to achieve this week? Remember: specific goals are more achievable! Break it down into tiny steps! 📝✨";

    case "/gratitude":
      return "🙏 Gratitude is a superpower! Name 3 things you're grateful for right now - big or small! Research shows gratitude literally rewires your brain for happiness! 💖🧠";

    case "/energy":
      return "⚡ Energy boost incoming! Try this: stretch your arms up high, take 3 deep breaths, and smile! Your body language affects your mood instantly! 🤸‍♀️💪✨";

    case "/testmodal":
      // This will trigger an API key error to test the modal
      if (typeof window !== "undefined") {
        // Reset the prompted flag for testing
        const { clearApiKeyPrompted } = require("./storage");
        clearApiKeyPrompted();
        // Trigger the modal by simulating an API key error
        window.dispatchEvent(new CustomEvent("triggerApiKeyModal"));
      }
      return "🧪 Testing API key modal... Modal should appear if not already prompted!";

    case "/help":
      return "🎮 Available commands:\n/mood - Check in on your feelings\n/journal - Guided reflection\n/dance - Let's party! 💃\n/fortune - Daily wisdom\n/magic - Cast a spell! ✨\n/rocket - Blast off mode! 🚀\n/party - Celebration time! 🎉\n/zen - Find your peace 🧘‍♀️\n/superhero - Unlock your powers! 🦸‍♀️\n/inspire - Get motivated! 🌟\n/quote - Wisdom quotes 💭\n/goals - Set intentions 🎯\n/gratitude - Practice thankfulness 🙏\n/energy - Quick boost ⚡\n/testmodal - Test API key modal 🧪\n\nJust type normally and I'll respond naturally! ✨";

    default:
      return "🤔 Hmm, I don't recognize that command! Try /help to see what I can do, or just chat with me normally! ✨";
  }
}

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

// Mock quick replies generator
export function getMockQuickReplies(aiResponse: string): string[] {
  const response = aiResponse.toLowerCase();

  // Question-based responses
  if (
    response.includes("?") ||
    response.includes("tell me") ||
    response.includes("share")
  ) {
    return [
      "Sure thing!",
      "Let me think...",
      "That's interesting",
      "Tell me more",
    ];
  }

  // Positive/encouraging responses
  if (response.match(/\b(great|amazing|wonderful|awesome|fantastic|love)\b/)) {
    return ["Thank you!", "You're so kind", "That means a lot", "I'm grateful"];
  }

  // Challenge/activity responses
  if (
    response.includes("challenge") ||
    response.includes("try") ||
    response.includes("activity")
  ) {
    return ["I'm ready!", "Sounds fun!", "Let's do it", "Challenge accepted"];
  }

  // Advice/suggestion responses
  if (
    response.includes("suggest") ||
    response.includes("recommend") ||
    response.includes("try")
  ) {
    return ["Good idea!", "I'll try that", "Makes sense", "Thanks for the tip"];
  }

  // Celebration responses
  if (
    response.match(/\b(party|celebrate|amazing|congrats|proud)\b/) ||
    response.includes("🎉")
  ) {
    return [
      "Let's celebrate!",
      "I'm so happy",
      "This is awesome",
      "Party time!",
    ];
  }

  // Reflective responses
  if (
    response.includes("perspective") ||
    response.includes("think") ||
    response.includes("feel")
  ) {
    return ["That's deep", "I agree", "Interesting point", "Makes me think"];
  }

  // Command responses
  if (response.includes("/") || response.includes("command")) {
    return ["Show me more", "That's cool", "How neat!", "Fun feature"];
  }

  // Productivity responses
  if (response.match(/\b(work|focus|goal|plan|productive)\b/)) {
    return ["Let's do this!", "I'm motivated", "Great plan", "You got this!"];
  }

  // Wellness responses
  if (response.match(/\b(relax|wellness|health|mindful|peace)\b/)) {
    return ["So peaceful", "I feel better", "Good for me", "Thanks for caring"];
  }

  // Learning responses
  if (response.match(/\b(learn|knowledge|skill|grow|discover)\b/)) {
    return [
      "I want to learn!",
      "That's fascinating",
      "Teach me more",
      "I'm curious",
    ];
  }

  // Default positive responses
  return [
    "That's helpful",
    "Tell me more",
    "I appreciate that",
    "Thanks for sharing",
  ];
}
