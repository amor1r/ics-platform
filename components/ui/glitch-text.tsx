'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export function GlitchText({
  children,
  className,
  intensity = 'medium',
}: GlitchTextProps) {
  const intensityClasses = {
    low: 'glitch-text',
    medium: 'glitch-text',
    high: 'glitch-text',
  };

  return (
    <span
      className={cn(
        'inline-block text-primary-500',
        intensityClasses[intensity],
        className
      )}
    >
      {children}
    </span>
  );
}

