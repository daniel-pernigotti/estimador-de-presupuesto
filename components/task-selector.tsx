"use client";

import { tasks, categories, type TaskSelection } from "@/lib/tasks-data";
import { TaskCard } from "@/components/task-card";
import { ClarificationCard } from "@/components/clarification-card";
import { ChevronRight } from "lucide-react";

interface TaskSelectorProps {
  selections: TaskSelection;
  totals: { totalPrice: number; totalHours: number };
  onToggle: (taskId: string) => void;
  onQuantityChange: (taskId: string, quantity: number) => void;
  onViewSummary: () => void;
}

export function TaskSelector({
  selections,
  onToggle,
  onQuantityChange,
  onViewSummary,
}: TaskSelectorProps) {
  const getVisibleTasksForCategory = (category: string) => {
    // Get all tasks in this category that are NOT "Solo visible en el resumen"
    const categoryTasks = tasks.filter(
      (task) =>
        task.category === category &&
        task.component !== "Solo visible en el resumen",
    );

    const result: typeof categoryTasks = [];

    for (const task of categoryTasks) {
      // Skip dependent tasks here - we'll add them after their parent(s)
      if (task.visibleWhen) continue;

      // Determine if this main task should be disabled due to mutual exclusivity
      let disabled = false;
      if (task.mutuallyExclusiveWith) {
        const otherSel = selections[task.mutuallyExclusiveWith];
        if (otherSel && (otherSel.enabled || otherSel.quantity > 0)) {
          disabled = true;
        }
      }

      // Add the main task (possibly disabled)
      result.push({ ...(task as any), __disabled: disabled } as any);

      // Find and add dependent tasks that should appear right after this task
      const dependentTasks = categoryTasks.filter((t) => {
        if (!t.visibleWhen) return false;
        const dependencies = t.visibleWhen.split("|");
        return dependencies.includes(task.id);
      });

      for (const depTask of dependentTasks) {
        // For dependent tasks, compute whether any of their dependencies is active
        const dependencies = depTask.visibleWhen!.split("|");
        const anyActive = dependencies.some((depId) => {
          const sel = selections[depId];
          return sel && (sel.enabled || sel.quantity > 0);
        });

        const depDisabled = !anyActive;

        // Add dependent task (still visible but possibly disabled)
        if (!result.find((r) => r.id === depTask.id)) {
          result.push({ ...(depTask as any), __disabled: depDisabled } as any);
        }
      }
    }

    return result;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
        <div className="max-w-[600px] mx-auto">
          <h1 className="text-lg font-semibold">
            Estimador de presupuesto y tiempo
          </h1>
        </div>
      </header>

      <main className="px-4 py-6 pb-32 max-w-[600px] mx-auto">
        <ClarificationCard />
        {categories.map((category) => {
          const visibleTasks = getVisibleTasksForCategory(category);
          if (visibleTasks.length === 0) return null;

          return (
            <section key={category} className="mb-8">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">
                {category}
              </h2>
              <div className="space-y-3">
                {visibleTasks.map((task: any) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    selection={selections[task.id]}
                    disabled={!!task.__disabled}
                    onToggle={() => onToggle(task.id)}
                    onQuantityChange={(qty) => onQuantityChange(task.id, qty)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-4">
        <div className="max-w-[600px] mx-auto">
          <button
            onClick={onViewSummary}
            className="w-full bg-[#26FF1B] text-black py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-colors"
          >
            Estimar
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
