"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Key, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveApiKey: (apiKey: string) => void;
  onSkip: () => void;
}

export default function ApiKeyModal({
  isOpen,
  onClose,
  onSaveApiKey,
  onSkip,
}: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleSave = async () => {
    if (!apiKey.trim()) return;

    setIsValidating(true);
    try {
      // Validate the API key format
      if (!apiKey.startsWith("sk-or-v1-")) {
        throw new Error("Invalid API key format");
      }

      onSaveApiKey(apiKey.trim());
      setApiKey("");
      onClose();
    } catch (error) {
      console.error("Invalid API key:", error);
      // You could add a toast notification here
    } finally {
      setIsValidating(false);
    }
  };

  const handleSkip = () => {
    setApiKey("");
    onSkip();
    onClose();
  };

  const handleClose = () => {
    setApiKey("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            API Key Limit Reached
          </DialogTitle>
          <DialogDescription className="text-left">
            Your current OpenRouter API key has reached its usage limit. Please
            add a new API key to continue using the AI features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning Banner */}
          <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-800 dark:text-orange-300">
              <p className="font-medium mb-1">API Key Required</p>
              <p>
                Get a new API key from{" "}
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline font-medium"
                >
                  OpenRouter
                </a>{" "}
                to continue chatting with the AI.
              </p>
            </div>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label
              htmlFor="apiKey"
              className="text-sm font-medium text-foreground"
            >
              OpenRouter API Key
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Key className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="pl-10 pr-10"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && apiKey.trim()) {
                    handleSave();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never shared.
            </p>
          </div>

          {/* How to get API key */}
          <div className="bg-muted/30 p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">How to get an API key:</h4>
            <ol className="text-xs text-muted-foreground space-y-1">
              <li>1. Visit openrouter.ai and create an account</li>
              <li>2. Go to the API Keys section</li>
              <li>3. Create a new API key</li>
              <li>4. Copy and paste it above</li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1"
              disabled={isValidating}
            >
              Skip for Now
            </Button>
            <Button
              onClick={handleSave}
              disabled={!apiKey.trim() || isValidating}
              className="flex-1"
            >
              {isValidating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                />
              ) : (
                "Save API Key"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
