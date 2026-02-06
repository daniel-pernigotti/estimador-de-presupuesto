"use client";

import {
  tasks,
  formatPrice,
  formatTime,
  formatDate,
  type TaskSelection,
} from "@/lib/tasks-data";
import { ArrowLeft, Download, Pencil } from "lucide-react";
import { DateRangeBar } from "@/components/date-range-bar";
import { generatePDF } from "@/lib/generate-pdf";
import { useState, useRef, useEffect } from "react";

interface SummaryProps {
  selections: TaskSelection;
  totals: { totalPrice: number; totalHours: number };
  startDate: Date;
  onStartDateChange: (date: Date) => void;
  onBack: () => void;
}

export function Summary({
  selections,
  totals,
  startDate,
  onStartDateChange,
  onBack,
}: SummaryProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Calculate end date from start date + business days
  const businessDays = Math.ceil(totals.totalHours / 8);
  let daysAdded = 0;
  const end = new Date(startDate);
  while (daysAdded < businessDays) {
    end.setDate(end.getDate() + 1);
    const dayOfWeek = end.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++;
    }
  }

  const selectedTasks = tasks.filter((task) => {
    const selection = selections[task.id];
    if (!selection) return false;

    if (task.component === "Quantity") {
      return selection.quantity > 0;
    }
    return selection.enabled;
  });

  const essentialTasks = selectedTasks.filter((t) => t.category === "Esencial");
  const userSelectedTasks = selectedTasks.filter(
    (t) => t.category !== "Esencial" && t.category !== "Incluido gratis",
  );
  const freeIncludedTasks = selectedTasks.filter(
    (t) => t.category === "Incluido gratis",
  );

  const handleDownload = () => {
    generatePDF(selectedTasks, selections, totals, { start: startDate, end });
  };

  const handleWhatsApp = () => {
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : "";
    const message = encodeURIComponent(
      `Hola, te escribo desde el estimador de presupuesto para consultar por mi proyecto web\n------------------------------------------------------------\nTotal estimado: ${formatPrice(totals.totalPrice)}\nTiempo estimado: ${formatTime(totals.totalHours)}\n------------------------------------------------------------\nVer detalle: ${currentUrl}`,
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  // Close date picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4 max-w-[600px] mx-auto w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
          <span>Volver</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-[600px] mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Resumen</h1>

        <div className="space-y-4 mb-6">
          {essentialTasks.map((task) => (
            <SummaryItem
              key={task.id}
              name={task.name}
              price={task.price}
              quantity={selections[task.id]?.quantity}
            />
          ))}

          {userSelectedTasks.map((task) => (
            <SummaryItem
              key={task.id}
              name={task.name}
              price={task.price}
              quantity={
                task.component === "Quantity"
                  ? selections[task.id]?.quantity
                  : undefined
              }
            />
          ))}
        </div>

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#26FF1B] font-medium mb-8 hover:underline"
        >
          <Pencil className="w-4 h-4" />
          Editar requisitos
        </button>

        {freeIncludedTasks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-6">Incluido gratis</h2>
            <div className="space-y-3">
              {freeIncludedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between gap-4"
                >
                  <span className="text-sm leading-tight text-white">
                    {task.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 bg-background border-t border-border px-4 py-4 max-w-[600px] mx-auto w-full">
        <div className="space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-xl">
              {formatPrice(totals.totalPrice)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">Tiempo estimado</span>
            <span className="font-bold text-xl">
              {formatTime(totals.totalHours)}
            </span>
          </div>

          <div className="relative" ref={datePickerRef}>
            <DateRangeBar
              startDate={formatDate(startDate)}
              endDate={formatDate(end)}
              onStartDateClick={() => setShowDatePicker(!showDatePicker)}
            />
            {showDatePicker && (
              <DatePickerPopup
                selectedDate={startDate}
                onDateSelect={(date) => {
                  onStartDateChange(date);
                  setShowDatePicker(false);
                }}
                onClose={() => setShowDatePicker(false)}
              />
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 border border-border py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-accent transition-colors"
          >
            <Download className="w-5 h-5" />
            Descargar
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 bg-[#26FF1B] text-black py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-colors"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Consultar
          </button>
        </div>
      </footer>
    </div>
  );
}

function SummaryItem({
  name,
  price,
  quantity,
}: {
  name: string;
  price: number;
  quantity?: number;
}) {
  const displayName = quantity && quantity > 1 ? `${name} (${quantity})` : name;
  const totalPrice = quantity ? price * quantity : price;

  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm leading-tight text-white">{displayName}</span>
      <span className="text-sm font-medium tabular-nums flex-shrink-0 text-white">
        {formatPrice(totalPrice)}
      </span>
    </div>
  );
}

function DatePickerPopup({
  selectedDate,
  onDateSelect,
  onClose,
}: {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const dayNames = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isPastDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border rounded-lg p-4 shadow-lg z-20">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
            )
          }
          className="p-1 hover:bg-accent rounded"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <span className="font-medium">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
            )
          }
          className="p-1 hover:bg-accent rounded"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-muted-foreground py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => {
          if (!date) {
            return <div key={i} />;
          }

          const disabled = isWeekend(date) || isPastDate(date);
          const selected = isSelected(date);

          return (
            <button
              key={i}
              onClick={() => !disabled && onDateSelect(date)}
              disabled={disabled}
              className={`
                p-2 text-sm rounded transition-colors
                ${disabled ? "text-muted-foreground/30 cursor-not-allowed" : "hover:bg-accent cursor-pointer"}
                ${selected ? "bg-[#26FF1B] text-black hover:bg-[#26FF1B]" : ""}
                ${isWeekend(date) ? "text-muted-foreground/30" : ""}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
