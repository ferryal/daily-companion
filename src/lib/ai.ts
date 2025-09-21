// AI Integration Layer with OpenRouter and multiple LLM models
export interface AIMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface AIResponse {
  content: string;
  quickReplies?: string[];
  error?: string;
  requiresApiKey?: boolean;
}

export interface ApiKeyError {
  isApiKeyError: boolean;
  message: string;
  code?: number;
}

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextLength: number;
  pricing: {
    prompt: number;
    completion: number;
  };
  capabilities: string[];
}

export const AVAILABLE_MODELS: LLMModel[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    description: "Fast, cost-effective GPT-4 variant",
    contextLength: 128000,
    pricing: { prompt: 0.15, completion: 0.6 },
    capabilities: ["chat", "coding", "analysis"],
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    description: "Reliable and efficient for most tasks",
    contextLength: 16384,
    pricing: { prompt: 0.5, completion: 1.5 },
    capabilities: ["chat", "writing", "general"],
  },
  {
    id: "anthropic/claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    description: "Fast and thoughtful responses",
    contextLength: 200000,
    pricing: { prompt: 0.25, completion: 1.25 },
    capabilities: ["chat", "analysis", "writing"],
  },
  {
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    description: "Advanced reasoning and coding",
    contextLength: 200000,
    pricing: { prompt: 3, completion: 15 },
    capabilities: ["chat", "coding", "reasoning", "analysis"],
  },
  {
    id: "google/gemini-flash-1.5",
    name: "Gemini Flash 1.5",
    provider: "Google",
    description: "Fast multimodal AI model",
    contextLength: 1000000,
    pricing: { prompt: 0.075, completion: 0.3 },
    capabilities: ["chat", "multimodal", "analysis"],
  },
  {
    id: "google/gemini-pro-1.5",
    name: "Gemini Pro 1.5",
    provider: "Google",
    description: "Advanced multimodal capabilities",
    contextLength: 2000000,
    pricing: { prompt: 1.25, completion: 5 },
    capabilities: ["chat", "multimodal", "reasoning", "analysis"],
  },
  {
    id: "x-ai/grok-beta",
    name: "Grok Beta",
    provider: "xAI",
    description: "Witty and real-time aware",
    contextLength: 131072,
    pricing: { prompt: 5, completion: 15 },
    capabilities: ["chat", "real-time", "humor"],
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek Chat",
    provider: "DeepSeek",
    description: "Efficient and cost-effective",
    contextLength: 32768,
    pricing: { prompt: 0.14, completion: 0.28 },
    capabilities: ["chat", "reasoning", "coding"],
  },
];

class AIService {
  private apiKey: string | null = null;
  private baseUrl = "https://openrouter.ai/api/v1";
  private currentModel: string = "anthropic/claude-3-haiku";
  private defaultApiKey =
    "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";
  private onApiKeyError?: (error: ApiKeyError) => void;

  constructor() {
    this.loadApiKey().catch(console.error);

    // Listen for API key updates
    if (typeof window !== "undefined") {
      window.addEventListener("apiKeyUpdated", (event: Event) => {
        const customEvent = event as CustomEvent;
        this.apiKey = customEvent.detail;
      });

      window.addEventListener("apiKeyCleared", () => {
        this.apiKey = this.defaultApiKey;
      });
    }
  }

  private async loadApiKey() {
    if (typeof window !== "undefined") {
      const { getApiKey } = await import("./storage");
      const storedKey = getApiKey();
      // Only use stored key if it exists and is different from default
      this.apiKey =
        storedKey && storedKey !== this.defaultApiKey
          ? storedKey
          : this.defaultApiKey;
    } else {
      this.apiKey = this.defaultApiKey;
    }
  }

  setApiKeyErrorHandler(handler: (error: ApiKeyError) => void) {
    this.onApiKeyError = handler;
  }

  async updateApiKey(newApiKey: string) {
    this.apiKey = newApiKey;
    if (typeof window !== "undefined") {
      const { saveApiKey } = await import("./storage");
      saveApiKey(newApiKey);
    }
  }

  getCurrentApiKey(): string | null {
    return this.apiKey;
  }

  async clearApiKey() {
    this.apiKey = this.defaultApiKey;
    if (typeof window !== "undefined") {
      const { clearApiKey } = await import("./storage");
      clearApiKey();
    }
  }

  private isApiKeyLimitError(error: {
    message?: string;
    status?: number;
    code?: number;
  }): boolean {
    // Check for various API key limit error patterns
    const errorMessage = error?.message?.toLowerCase() || "";
    const statusCode = error?.status || error?.code;

    return (
      statusCode === 401 ||
      statusCode === 403 ||
      errorMessage.includes("user not found") ||
      errorMessage.includes("api key") ||
      errorMessage.includes("unauthorized") ||
      errorMessage.includes("forbidden") ||
      errorMessage.includes("limit") ||
      errorMessage.includes("quota")
    );
  }

  setModel(modelId: string) {
    const model = AVAILABLE_MODELS.find((m) => m.id === modelId);
    if (model) {
      this.currentModel = modelId;
    }
  }

  getCurrentModel(): LLMModel {
    return (
      AVAILABLE_MODELS.find((m) => m.id === this.currentModel) ||
      AVAILABLE_MODELS[0]
    );
  }

  getAvailableModels(): LLMModel[] {
    return AVAILABLE_MODELS;
  }

  async sendMessage(messages: AIMessage[]): Promise<AIResponse> {
    if (!this.apiKey) {
      // Use mock response when no API key is available at all
      return await this.getMockResponse(messages[messages.length - 1].content);
    }

    try {
      const systemPrompt = this.buildSystemPrompt();

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            typeof window !== "undefined"
              ? window.location.origin
              : "https://localhost:3000",
          "X-Title": "Daily Companion",
        },
        body: JSON.stringify({
          model: this.currentModel,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          ],
          temperature: 0.7,
          max_tokens: 400,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const error = {
          status: response.status,
          message: errorData?.error?.message || "Unknown error",
          code: errorData?.error?.code,
        };

        // Check if this is an API key related error
        if (this.isApiKeyLimitError(error)) {
          // Check if user has already been prompted
          const { hasBeenPromptedForApiKey } = await import("./storage");
          const hasBeenPrompted = hasBeenPromptedForApiKey();

          if (!hasBeenPrompted && this.onApiKeyError) {
            const apiKeyError: ApiKeyError = {
              isApiKeyError: true,
              message: error.message,
              code: error.status,
            };
            this.onApiKeyError(apiKeyError);
          }

          return await this.getMockResponse(
            messages[messages.length - 1].content
          );
        }

        throw new Error(`API Error: ${response.status} - ${error.message}`);
      }

      const data = await response.json();
      const content =
        data.choices[0]?.message?.content || "Sorry, I couldn't process that.";

      // Generate AI-powered quick replies
      const quickReplies = await this.generateQuickReplies(content);

      return {
        content,
        quickReplies,
      };
    } catch (error) {
      console.error("AI API Error:", error);

      // Check if this is an API key error before falling back
      if (
        this.isApiKeyLimitError(
          error as { message?: string; status?: number; code?: number }
        )
      ) {
        // Check if user has already been prompted
        const { hasBeenPromptedForApiKey } = await import("./storage");
        const hasBeenPrompted = hasBeenPromptedForApiKey();

        if (!hasBeenPrompted && this.onApiKeyError) {
          const apiKeyError: ApiKeyError = {
            isApiKeyError: true,
            message:
              (error as { message?: string })?.message ||
              "API key limit reached",
          };
          this.onApiKeyError(apiKeyError);
        }

        return await this.getMockResponse(
          messages[messages.length - 1].content
        );
      }

      // Fallback to mock response on other errors
      return await this.getMockResponse(messages[messages.length - 1].content);
    }
  }

  private buildSystemPrompt(): string {
    return `You are a helpful, encouraging, and empathetic AI companion in the "Daily Companion" app. Your role is to:

1. Provide supportive and positive responses that help users build healthy daily habits
2. Keep responses concise but meaningful (2-3 sentences max)
3. Be encouraging about their progress and streaks
4. Offer gentle motivation without being pushy
5. Use a warm, friendly tone that feels personal
6. Acknowledge their achievements and celebrate small wins
7. Provide practical advice when asked
8. Remember this is a daily habit-building app focused on wellness and positivity

Current model: ${this.getCurrentModel().name} (${
      this.getCurrentModel().provider
    })

Keep responses engaging and conversational while staying focused on personal growth and daily wellness.`;
  }

  async generateQuickReplies(aiResponse: string): Promise<string[]> {
    if (!this.apiKey) {
      return this.getFallbackQuickReplies(aiResponse);
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            typeof window !== "undefined"
              ? window.location.origin
              : "https://localhost:3000",
          "X-Title": "Daily Companion",
        },
        body: JSON.stringify({
          model: this.currentModel,
          messages: [
            {
              role: "system",
              content: `Generate 3-4 contextual quick reply options for the user based on the AI response. These should be:
              1. Natural conversation continuations
              2. Relevant follow-up questions
              3. Positive engagement options
              4. Short (2-7 words each)
              
              Return ONLY a JSON array of strings, no other text.
              Example: ["Tell me more", "That's helpful!", "What about...", "I'd like to try that"]`,
            },
            {
              role: "assistant",
              content: aiResponse,
            },
            {
              role: "user",
              content: "Generate quick reply options for this response.",
            },
          ],
          temperature: 0.8,
          max_tokens: 100,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content || "[]";

        try {
          const replies = JSON.parse(content);
          if (Array.isArray(replies)) {
            return replies.slice(0, 4); // Limit to 4 replies
          }
        } catch {
          console.log("Failed to parse quick replies JSON");
        }
      } else {
        // Check if this is an API key error for quick replies too
        if (response.status === 401 || response.status === 403) {
          // Silently fall back to default replies for quick reply errors
          return this.getFallbackQuickReplies(aiResponse);
        }
      }
    } catch (error) {
      console.error("Quick replies generation error:", error);
    }

    // Fallback quick replies
    return this.getFallbackQuickReplies(aiResponse);
  }

  private getFallbackQuickReplies(aiResponse: string): string[] {
    const responses = aiResponse.toLowerCase();

    if (responses.includes("question") || responses.includes("?")) {
      return ["Yes, definitely", "Tell me more", "Not really", "I'm curious"];
    } else if (
      responses.includes("congratulations") ||
      responses.includes("great")
    ) {
      return ["Thank you!", "I'm proud too", "What's next?", "Keep going"];
    } else if (responses.includes("suggestion") || responses.includes("try")) {
      return [
        "Sounds good!",
        "I'll try that",
        "Any other tips?",
        "How do I start?",
      ];
    } else {
      return ["That's helpful", "Tell me more", "I agree", "What else?"];
    }
  }

  private async getMockResponse(userMessage: string): Promise<AIResponse> {
    // Dynamic import for mock responses
    const { getMockResponse, getMockQuickReplies } = await import("./mock");
    const content = await getMockResponse(userMessage);
    const quickReplies = getMockQuickReplies(content);
    return { content, quickReplies };
  }
}

export const aiService = new AIService();
