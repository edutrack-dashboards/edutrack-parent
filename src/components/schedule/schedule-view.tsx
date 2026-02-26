"use client";

import { useState } from "react";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";

interface ScheduleItemDisplay {
  id: string;
  classId: string;
  period: number;
  startTime: string;
  endTime: string;
  dayOfWeek: number;
  className: string;
  classRoom: string;
  subject: string;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ScheduleView({ items }: { items: ScheduleItemDisplay[] }) {
  const todayIndex = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(todayIndex);

  const dayItems = items
    .filter((item) => item.dayOfWeek === selectedDay)
    .sort((a, b) => a.period - b.period);

  // Only show Mon-Fri by default
  const weekdays = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-6">
      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {weekdays.map((dayIndex) => {
          const isToday = dayIndex === todayIndex;
          const isSelected = dayIndex === selectedDay;
          const hasClasses = items.some((item) => item.dayOfWeek === dayIndex);

          return (
            <button
              key={dayIndex}
              onClick={() => setSelectedDay(dayIndex)}
              className={cn(
                "flex min-w-[80px] flex-col items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors cursor-pointer",
                isSelected
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
                !hasClasses && !isSelected && "opacity-60",
              )}
            >
              <span className="text-xs">{SHORT_DAYS[dayIndex]}</span>
              <span className="mt-0.5 font-semibold">{DAYS[dayIndex]}</span>
              {isToday && (
                <span
                  className={cn(
                    "mt-1 h-1.5 w-1.5 rounded-full",
                    isSelected ? "bg-white" : "bg-blue-600",
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Schedule for selected day */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900">
            {DAYS[selectedDay]}&apos;s Schedule
          </h3>
          <p className="mt-0.5 text-sm text-gray-500">
            {dayItems.length} {dayItems.length === 1 ? "class" : "classes"}
          </p>
        </div>

        {dayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <CalendarDays className="mb-2 h-8 w-8" />
            <p className="text-sm">No classes scheduled</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {dayItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
                  P{item.period}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-900">{item.className}</h4>
                  <p className="text-sm text-gray-500">{item.subject}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTime(item.startTime)} - {formatTime(item.endTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      Room {item.classRoom}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
