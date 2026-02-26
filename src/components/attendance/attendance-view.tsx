"use client";

import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import {
  cn,
  getAttendanceTextColor,
  getAttendanceBgColor,
  getAttendanceLabel,
  formatDate,
} from "@/lib/utils";
import type { AttendanceStatus } from "@/lib/types";

interface RecordDisplay {
  id: string;
  date: string;
  status: AttendanceStatus;
  className: string;
  note?: string;
}

interface ClassRate {
  classId: string;
  className: string;
  rate: number;
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
}

interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
}

interface AttendanceViewProps {
  records: RecordDisplay[];
  overallRate: number;
  classRates: ClassRate[];
  summary: AttendanceSummary;
}

export function AttendanceView({
  records,
  overallRate,
  classRates,
  summary,
}: AttendanceViewProps) {
  const [filter, setFilter] = useState<AttendanceStatus | "all">("all");

  const filteredRecords =
    filter === "all" ? records : records.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      {/* Overall rate + Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-5 sm:col-span-2 lg:col-span-1">
          <p className="text-sm text-gray-500">Overall Rate</p>
          <p
            className={cn(
              "mt-1 text-3xl font-bold",
              overallRate >= 90
                ? "text-emerald-600"
                : overallRate >= 80
                  ? "text-amber-600"
                  : "text-red-600",
            )}
          >
            {overallRate}%
          </p>
          <p className="mt-1 text-xs text-gray-400">{summary.total} records</p>
        </div>
        {(["present", "absent", "late", "excused"] as const).map((status) => (
          <div
            key={status}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <p className="text-sm text-gray-500">{getAttendanceLabel(status)}</p>
            <p className={cn("mt-1 text-2xl font-bold", getAttendanceTextColor(status))}>
              {summary[status]}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {summary.total > 0
                ? Math.round((summary[status] / summary.total) * 100)
                : 0}
              %
            </p>
          </div>
        ))}
      </div>

      {/* Per-class rates */}
      {classRates.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Attendance by Class</h3>
          <div className="space-y-3">
            {classRates.map((cls) => (
              <div key={cls.classId} className="flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {cls.className}
                    </p>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        cls.rate >= 90
                          ? "text-emerald-600"
                          : cls.rate >= 80
                            ? "text-amber-600"
                            : "text-red-600",
                      )}
                    >
                      {cls.rate}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        cls.rate >= 90
                          ? "bg-emerald-500"
                          : cls.rate >= 80
                            ? "bg-amber-500"
                            : "bg-red-500",
                      )}
                      style={{ width: `${cls.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Records list */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <h3 className="font-semibold text-gray-900">Attendance History</h3>
          <div className="flex gap-1">
            {(["all", "present", "absent", "late", "excused"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                    filter === status
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:bg-gray-100",
                  )}
                >
                  {status === "all" ? "All" : getAttendanceLabel(status)}
                </button>
              ),
            )}
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <ClipboardCheck className="mb-2 h-8 w-8" />
            <p className="text-sm">No records found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredRecords.slice(0, 50).map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {record.className}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(record.date)}
                    {record.note && ` — ${record.note}`}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                    getAttendanceTextColor(record.status),
                    getAttendanceBgColor(record.status),
                  )}
                >
                  {getAttendanceLabel(record.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
