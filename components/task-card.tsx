"use client";

import type React from "react";

import type { Task, TaskSelection } from "@/lib/tasks-data";
import { Switch } from "@/components/ui/switch";
import { QuantitySelector } from "@/components/quantity-selector";
import { useRef } from "react";

interface TaskCardProps {
  task: Task;
  selection: TaskSelection[string];
  onToggle: () => void;
  onQuantityChange: (quantity: number) => void;
  disabled?: boolean;
}

export function TaskCard({
  task,
  selection,
  onToggle,
  onQuantityChange,
  disabled = false,
}: TaskCardProps) {
  const quantityInputRef = useRef<HTMLInputElement>(null);

  const handleCardClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest('[data-slot="switch"]') ||
      (e.target as HTMLElement).closest("[data-quantity-control]")
    ) {
      return;
    }
    if (disabled) return;

    if (task.component === "Toggle") {
      onToggle();
    } else {
      quantityInputRef.current?.focus();
      quantityInputRef.current?.select();
    }
  };

  return (
    <div
      className={`bg-card border border-border rounded-lg p-4 transition-colors ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:border-border/80"
      }`}
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Title and description grouped together */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <span className="text-sm font-medium leading-tight">{task.name}</span>
          {task.description && task.description.length > 0 && (
            <p className="text-sm leading-relaxed" style={{ color: "#C4C4C4" }}>
              {task.description}
            </p>
          )}
        </div>

        <div className="flex-shrink-0">
          {task.component === "Toggle" ? (
            <Switch
              checked={selection?.enabled || false}
              onCheckedChange={onToggle}
              disabled={disabled}
            />
          ) : (
            <QuantitySelector
              value={selection?.quantity || 0}
              onChange={onQuantityChange}
              inputRef={quantityInputRef}
              disabled={disabled}
            />
          )}
        </div>
      </div>
    </div>
  );
}
