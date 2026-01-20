import { type Task, type TaskSelection, formatPrice, formatTime, formatDate } from "./tasks-data"

export function generatePDF(
  selectedTasks: Task[],
  selections: TaskSelection,
  totals: { totalPrice: number; totalHours: number },
  dates: { start: Date; end: Date },
) {
  const essentialTasks = selectedTasks.filter((t) => t.category === "Esencial")
  const userSelectedTasks = selectedTasks.filter((t) => t.category !== "Esencial" && t.category !== "Incluido gratis")
  const freeIncludedTasks = selectedTasks.filter((t) => t.category === "Incluido gratis")

  let content = `PRESUPUESTO - ESTIMADOR DE TIEMPO Y COSTO\n`
  content += `==========================================\n\n`
  content += `Fecha de generación: ${formatDate(new Date())}\n\n`

  content += `SERVICIOS ESENCIALES\n`
  content += `--------------------\n`
  essentialTasks.forEach((task) => {
    const qty = selections[task.id]?.quantity || 1
    const total = task.price * qty
    content += `• ${task.name}: ${formatPrice(total)}\n`
  })

  content += `\nSERVICIOS SELECCIONADOS\n`
  content += `-----------------------\n`
  userSelectedTasks.forEach((task) => {
    const qty = selections[task.id]?.quantity || 1
    const total = task.price * qty
    const qtyText = qty > 1 ? ` (x${qty})` : ""
    content += `• ${task.name}${qtyText}: ${formatPrice(total)}\n`
  })

  if (freeIncludedTasks.length > 0) {
    content += `\nINCLUIDO GRATIS\n`
    content += `---------------\n`
    freeIncludedTasks.forEach((task) => {
      content += `• ${task.name}\n`
    })
  }

  content += `\n==========================================\n`
  content += `TOTAL: ${formatPrice(totals.totalPrice)}\n`
  content += `TIEMPO ESTIMADO: ${formatTime(totals.totalHours)}\n`
  content += `\nFecha de inicio: ${formatDate(dates.start)}\n`
  content += `Fecha de finalización: ${formatDate(dates.end)}\n`
  content += `==========================================\n`

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `presupuesto-${new Date().toISOString().split("T")[0]}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
