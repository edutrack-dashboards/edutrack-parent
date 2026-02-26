import { CalendarDays, Clock } from "lucide-react";
import { formatTime } from "@/lib/utils";
import Link from "next/link";

interface ScheduleItemDisplay {
  id: string;
  period: number;
  startTime: string;
  endTime: string;
  className: string;
  classRoom: string;
  subject: string;
}

export function TodaySchedule({
  items,
  childId,
}: {
  items: ScheduleItemDisplay[];
  childId?: string;
}) {
  const scheduleHref = childId ? `/schedule?child=${childId}` : "/schedule";

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Today&apos;s Schedule</h3>
          <Link href={scheduleHref} className="text-sm text-blue-600 hover:text-blue-700">
            Full schedule
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <CalendarDays className="mb-2 h-8 w-8" />
          <p className="text-sm">No classes today</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Today&apos;s Schedule</h3>
        <Link href={scheduleHref} className="text-sm text-blue-600 hover:text-blue-700">
          Full schedule
        </Link>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
              P{item.period}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {item.className}
              </p>
              <p className="text-xs text-gray-500">{item.subject}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {formatTime(item.startTime)} - {formatTime(item.endTime)}
              </div>
              <p className="text-xs text-gray-400">Room {item.classRoom}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
