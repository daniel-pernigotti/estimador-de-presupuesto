"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TaskSelector } from "@/components/task-selector";
import { Summary } from "@/components/summary";
import { tasks, isTaskVisible, type TaskSelection } from "@/lib/tasks-data";

const START_DATE_BUFFER_DAYS = 2;

function encodeSelections(selections: TaskSelection): string {
  const encoded: string[] = [];
  Object.entries(selections).forEach(([id, sel]) => {
    if (sel.enabled || sel.quantity > 0) {
      encoded.push(`${id}:${sel.enabled ? 1 : 0}:${sel.quantity}`);
    }
  });
  return encoded.join(",");
}

function decodeSelections(param: string | null): TaskSelection | null {
  if (!param) return null;
  const selections: TaskSelection = {};

  // Initialize all tasks with defaults first
  tasks.forEach((task) => {
    if (task.category === "Esencial") {
      selections[task.id] = { enabled: true, quantity: 1 };
    } else if (task.component === "Toggle") {
      selections[task.id] = { enabled: false, quantity: 0 };
    } else if (task.component === "Quantity") {
      selections[task.id] = { enabled: false, quantity: 0 };
    } else {
      selections[task.id] = { enabled: true, quantity: 1 };
    }
  });

  // Override with URL params
  param.split(",").forEach((item) => {
    const [id, enabled, quantity] = item.split(":");
    if (id && enabled !== undefined && quantity !== undefined) {
      selections[id] = {
        enabled: enabled === "1",
        quantity: Number.parseInt(quantity, 10) || 0,
      };
    }
  });

  return selections;
}

function getInitialSelections(): TaskSelection {
  const initial: TaskSelection = {};
  tasks.forEach((task) => {
    if (task.category === "Esencial") {
      initial[task.id] = { enabled: true, quantity: 1 };
    } else if (task.component === "Toggle") {
      initial[task.id] = { enabled: false, quantity: 0 };
    } else if (task.component === "Quantity") {
      const defaultQty = task.defaultQuantity ?? 0;
      initial[task.id] = { enabled: defaultQty > 0, quantity: defaultQty };
    } else {
      initial[task.id] = { enabled: true, quantity: 1 };
    }
  });
  return initial;
}

function getDefaultStartDate(): Date {
  const today = new Date();
  let daysAdded = 0;
  const startDate = new Date(today);

  while (daysAdded < START_DATE_BUFFER_DAYS) {
    startDate.setDate(startDate.getDate() + 1);
    const dayOfWeek = startDate.getDay();
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++;
    }
  }

  return startDate;
}

export function BudgetEstimator() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [view, setView] = useState<"selector" | "summary">("selector");
  const [selections, setSelections] = useState<TaskSelection>(() => {
    const fromUrl = decodeSelections(searchParams.get("s"));
    return fromUrl || getInitialSelections();
  });

  const [startDate, setStartDate] = useState<Date>(() => {
    const dateParam = searchParams.get("d");
    if (dateParam) {
      const parsed = new Date(dateParam);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return getDefaultStartDate();
  });

  useEffect(() => {
    const encoded = encodeSelections(selections);
    const dateStr = startDate.toISOString().split("T")[0];
    const newUrl = `?s=${encoded}&d=${dateStr}`;
    router.replace(newUrl, { scroll: false });
  }, [selections, startDate, router]);

  const totals = useMemo(() => {
    let totalPrice = 0;
    let totalHours = 0;

    tasks.forEach((task) => {
      const selection = selections[task.id];
      if (!selection) return;

      // Only count if task is visible (or essential/free)
      if (task.category !== "Esencial" && task.category !== "Incluido gratis") {
        if (!isTaskVisible(task, selections)) return;
      }

      if (task.component === "Quantity" && selection.quantity > 0) {
        totalPrice += task.price * selection.quantity;
        totalHours += task.hours * selection.quantity;
      } else if (selection.enabled) {
        totalPrice += task.price;
        totalHours += task.hours;
      }
    });

    return { totalPrice, totalHours };
  }, [selections]);

  const handleToggle = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);

    setSelections((prev) => {
      const newSelections = { ...prev };
      const currentEnabled = prev[taskId]?.enabled;

      // Toggle the current task
      if (!currentEnabled) {
        newSelections[taskId] = {
          ...prev[taskId],
          enabled: true,
          quantity:
            task?.component === "Quantity" ? (prev[taskId]?.quantity ?? 1) : 0,
        };
      } else {
        newSelections[taskId] = {
          ...prev[taskId],
          enabled: false,
          quantity: 0,
        };
      }

      // If enabling and has mutual exclusivity, disable the other
      if (!currentEnabled && task?.mutuallyExclusiveWith) {
        const otherTask = tasks.find(
          (t) => t.id === task.mutuallyExclusiveWith,
        );
        if (otherTask) {
          newSelections[task.mutuallyExclusiveWith] = {
            ...prev[task.mutuallyExclusiveWith],
            enabled: false,
            quantity: 0,
          };
        }
      }

      if (currentEnabled) {
        // console.log('currentEnabled', currentEnabled)
        // Find tasks that depend on this one being active
        tasks.forEach((t) => {
          if (t.visibleWhen) {
            const dependencies = t.visibleWhen.split("|");
            if (dependencies.includes(taskId)) {
              // Check if ALL dependencies are now disabled
              const anyStillActive = dependencies.some((depId) => {
                if (depId === taskId) return false; // This one is being disabled
                const sel = newSelections[depId];
                return sel && (sel.enabled || sel.quantity > 0);
              });
              if (!anyStillActive) {
                newSelections[t.id] = {
                  ...prev[t.id],
                  enabled: false,
                  quantity: 0,
                };
              }
            }
          }
        });
      }

      return newSelections;
    });
  };

  const handleQuantityChange = (taskId: string, quantity: number) => {
    setSelections((prev) => ({
      ...prev,
      [taskId]: { ...prev[taskId], quantity, enabled: quantity > 0 },
    }));
  };

  if (view === "summary") {
    return (
      <Summary
        selections={selections}
        totals={totals}
        startDate={startDate}
        onStartDateChange={setStartDate}
        onBack={() => setView("selector")}
      />
    );
  }

  return (
    <TaskSelector
      selections={selections}
      totals={totals}
      onToggle={handleToggle}
      onQuantityChange={handleQuantityChange}
      onViewSummary={() => setView("summary")}
    />
  );
}
