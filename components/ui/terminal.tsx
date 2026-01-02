'use client';

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface TerminalProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  prompt?: string;
}

export function Terminal({
  children,
  title = "Terminal",
  className,
  prompt = "$",
}: TerminalProps) {
  const [copied, setCopied] = React.useState(false);
  const terminalRef = React.useRef<HTMLDivElement>(null);

  const copyToClipboard = () => {
    if (terminalRef.current) {
      const text = terminalRef.current.innerText;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={cn("terminal", className)}>
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-background-tertiary">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-secondary-500"></div>
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <div className="w-3 h-3 rounded-full bg-primary-500"></div>
          </div>
          <span className="text-sm text-text-secondary font-mono">{title}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-3 w-3 text-primary-500" />
          ) : (
            <Copy className="h-3 w-3 text-text-secondary" />
          )}
        </Button>
      </div>
      <div ref={terminalRef} className="font-mono text-sm">
        <div className="flex items-start gap-2">
          <span className="text-primary-500">{prompt}</span>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

