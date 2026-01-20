"use client"

import { tasks, categories, type TaskSelection } from "@/lib/tasks-data"
import { TaskCard } from "@/components/task-card"
import { ClarificationCard } from "@/components/clarification-card"
import { ChevronRight } from "lucide-react"

interface TaskSelectorProps {
  selections: TaskSelection
  totals: { totalPrice: number; totalHours: number }
  onToggle: (taskId: string) => void
  onQuantityChange: (taskId: string, quantity: number) => void
  onViewSummary: () => void
}

export function TaskSelector({ selections, onToggle, onQuantityChange, onViewSummary }: TaskSelectorProps) {
  const getVisibleTasksForCategory = (category: string) => {
    // Get all tasks in this category that are NOT "Solo visible en el resumen"
    const categoryTasks = tasks.filter(
      (task) => task.category === category && task.component !== "Solo visible en el resumen",
    )

    const result: typeof categoryTasks = []

    for (const task of categoryTasks) {
      // Skip dependent tasks here - they'll be added after their parent
      if (task.visibleWhen) continue

      // Check if this task should be visible (mutual exclusivity)
      if (task.mutuallyExclusiveWith) {
        const otherSel = selections[task.mutuallyExclusiveWith]
        // Hide if the other mutually exclusive task is active
        if (otherSel && (otherSel.enabled || otherSel.quantity > 0)) {
          continue
        }
      }

      // Add the main task
      result.push(task)

      // Find and add dependent tasks that should appear right after this task
      const dependentTasks = categoryTasks.filter((t) => {
        if (!t.visibleWhen) return false
        const dependencies = t.visibleWhen.split("|")
        return dependencies.includes(task.id)
      })

      for (const depTask of dependentTasks) {
        // Check if this task's parent is active
        const thisSel = selections[task.id]
        const isParentActive = thisSel && (thisSel.enabled || thisSel.quantity > 0)

        if (isParentActive) {
          // For tasks with OR dependency (like product-load), check if not already added
          if (!result.find((r) => r.id === depTask.id)) {
            result.push(depTask)
          }
        }
      }
    }

    return result
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
        <div className="max-w-[600px] mx-auto">
          <h1 className="text-lg font-semibold">Estimador de presupuesto y tiempo</h1>
        </div>
      </header>

      <main className="px-4 py-6 pb-32 max-w-[600px] mx-auto">
        {categories.map((category) => {
          const visibleTasks = getVisibleTasksForCategory(category)
          if (visibleTasks.length === 0) return null

          return (
            <section key={category} className="mb-8">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">{category}</h2>
              <div className="space-y-3">
                {visibleTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    selection={selections[task.id]}
                    onToggle={() => onToggle(task.id)}
                    onQuantityChange={(qty) => onQuantityChange(task.id, qty)}
                  />
                ))}
              </div>
            </section>
          )
        })}

        <ClarificationCard />
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
  )
}
