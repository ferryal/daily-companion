"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Zap, Brain, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { aiService, AVAILABLE_MODELS, type LLMModel } from "@/lib/ai";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  onModelChange?: (model: LLMModel) => void;
}

export function ModelSelector({ onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(
    aiService.getCurrentModel()
  );

  const handleModelSelect = (model: LLMModel) => {
    setSelectedModel(model);
    aiService.setModel(model.id);
    onModelChange?.(model);
    setIsOpen(false);
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "OpenAI":
        return "bg-emerald-500/20 text-emerald-600 border-emerald-500/20";
      case "Anthropic":
        return "bg-purple-500/20 text-purple-600 border-purple-500/20";
      case "Google":
        return "bg-blue-500/20 text-blue-600 border-blue-500/20";
      case "xAI":
        return "bg-gray-500/20 text-gray-600 border-gray-500/20";
      case "DeepSeek":
        return "bg-orange-500/20 text-orange-600 border-orange-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatPrice = (price: number) => {
    return price < 1 ? `$${price}` : `$${price.toFixed(1)}`;
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary hover:bg-primary/5 transition-all duration-200 text-sm min-w-0"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Brain className="h-4 w-4 text-primary flex-shrink-0" />
        <div className="flex flex-col items-start min-w-0 overflow-hidden">
          <span className="font-medium text-foreground truncate max-w-[120px] sm:max-w-[160px]">
            {selectedModel.name}
          </span>
          <span className="text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-[160px]">
            {selectedModel.provider}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute bottom-full left-0 right-0 mb-2 z-50 w-80 max-w-[90vw]"
            >
              <div className="bg-background/95 backdrop-blur-lg border border-border/50 rounded-2xl shadow-xl max-h-80 overflow-y-auto">
                <div className="p-3">
                  <div className="text-xs font-medium text-muted-foreground mb-3 px-1">
                    Choose AI Model
                  </div>

                  <div className="space-y-2">
                    {AVAILABLE_MODELS.map((model) => (
                      <motion.button
                        key={model.id}
                        onClick={() => handleModelSelect(model)}
                        className={cn(
                          "w-full p-3 rounded-xl text-left transition-all duration-200 border",
                          selectedModel.id === model.id
                            ? "bg-primary/10 border-primary/20 shadow-sm"
                            : "bg-background/50 border-border/30 hover:bg-muted/50 hover:border-border/50"
                        )}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-foreground">
                                {model.name}
                              </span>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs px-2 py-0.5",
                                  getProviderColor(model.provider)
                                )}
                              >
                                {model.provider}
                              </Badge>
                            </div>

                            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                              {model.description}
                            </p>

                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {(model.contextLength / 1000).toFixed(0)}K
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                <span>
                                  {formatPrice(model.pricing.prompt)}/M
                                </span>
                              </div>

                              {selectedModel.id === model.id && (
                                <div className="flex items-center gap-1 text-primary">
                                  <Zap className="h-3 w-3" />
                                  <span className="font-medium">Active</span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1 mt-2">
                              {model.capabilities
                                .slice(0, 3)
                                .map((capability) => (
                                  <Badge
                                    key={capability}
                                    variant="secondary"
                                    className="text-xs px-1.5 py-0.5 bg-muted/50 text-muted-foreground"
                                  >
                                    {capability}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-border/20 bg-muted/20">
                  <div className="text-xs text-muted-foreground text-center">
                    Powered by OpenRouter • Prices per 1M tokens
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
