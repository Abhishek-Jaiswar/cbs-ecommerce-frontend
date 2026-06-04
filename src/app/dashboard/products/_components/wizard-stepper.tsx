"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardStepperProps {
  currentStep: number;
  steps: { id: number; title: string; description: string }[];
}

export function WizardStepper({ currentStep, steps }: WizardStepperProps) {
  return (
    <div className="w-full py-4">
      {/* Horizontal steps display */}
      <div className="flex items-start justify-between w-full relative">
        {/* Background Connecting Line */}
        <div className="absolute top-4 sm:top-5 left-0 right-0 h-0.5 bg-muted -z-10" />
        
        {/* Active progress color line */}
        <div
          className="absolute top-4 sm:top-5 left-0 h-0.5 bg-primary -z-10 transition-all duration-500 ease-in-out"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10 bg-background px-1.5 sm:px-4">
              <div
                className={cn(
                  "h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-500",
                  isCompleted && "bg-primary border-primary text-primary-foreground scale-105 shadow-md",
                  isActive && "bg-background border-primary text-primary ring-4 ring-primary/15 scale-105",
                  !isCompleted && !isActive && "bg-background border-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <div className="mt-2.5 sm:mt-3 flex flex-col items-center text-center max-w-[70px] sm:max-w-[140px]">
                <span
                  className={cn(
                    "text-[10px] sm:text-xs font-semibold tracking-tight transition-colors duration-300 leading-tight",
                    isActive && "text-primary",
                    !isActive && "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground/60 hidden md:block mt-0.5 leading-tight">
                  {step.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
