'use client';

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrengthMeter?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrengthMeter = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [strength, setStrength] = React.useState(0);

    const calculateStrength = (password: string) => {
      let score = 0;
      if (password.length >= 12) score += 1;
      if (/[a-z]/.test(password)) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;
      return score;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (showStrengthMeter) {
        setStrength(calculateStrength(e.target.value));
      }
      props.onChange?.(e);
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("pr-10", className)}
            ref={ref}
            {...props}
            onChange={handleChange}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-text-secondary" />
            ) : (
              <Eye className="h-4 w-4 text-text-secondary" />
            )}
          </Button>
        </div>
        {showStrengthMeter && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    level <= strength
                      ? strength <= 2
                        ? "bg-secondary-500"
                        : strength <= 4
                        ? "bg-warning"
                        : "bg-primary-500"
                      : "bg-background-tertiary"
                  )}
                />
              ))}
            </div>
            <p className="text-xs text-text-tertiary">
              {strength === 0 && "ضعيف"}
              {strength === 1 && "ضعيف جداً"}
              {strength === 2 && "ضعيف"}
              {strength === 3 && "متوسط"}
              {strength === 4 && "قوي"}
              {strength === 5 && "قوي جداً"}
            </p>
          </div>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
