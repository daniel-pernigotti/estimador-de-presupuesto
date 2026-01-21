"use client";

interface DateRangeBarProps {
  startDate: string;
  endDate: string;
  onStartDateClick?: () => void;
}

export function DateRangeBar({
  startDate,
  endDate,
  onStartDateClick,
}: DateRangeBarProps) {
  return (
    <div className="bg-muted h-[52px] rounded-xl flex justify-center items-center gap-1">
      {/* Comienzo sub-container */}
      <button
        onClick={onStartDateClick}
        className="flex flex-col justify-center items-center flex-1 self-stretch py-2 px-3 gap-[10px] hover:opacity-80 transition-opacity"
      >
        <div className="flex flex-col items-start">
          <p className="text-xs text-muted-foreground">Comienzo</p>
          <p className="text-sm font-medium">{startDate}</p>
        </div>
      </button>

      {/* Vertical divider */}
      <div className="w-px h-8 bg-white" />

      {/* Finalización sub-container */}
      <div className="flex flex-col justify-center items-center flex-1 self-stretch py-2 px-3 gap-[10px]">
        <div className="flex flex-col items-start">
          <p className="text-xs text-muted-foreground">Finalización</p>
          <p className="text-sm font-medium">{endDate}</p>
        </div>
      </div>
    </div>
  );
}
