import { GraduationCap, ClipboardCheck, BookOpen, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardsProps {
  gpa: number | null;
  attendanceRate: number;
  classCount: number;
  upcomingExams: number;
}

export function StatCards({ gpa, attendanceRate, classCount, upcomingExams }: StatCardsProps) {
  const stats = [
    {
      label: "Average Grade",
      value: gpa !== null ? `${gpa}%` : "N/A",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Attendance Rate",
      value: `${attendanceRate}%`,
      icon: ClipboardCheck,
      color: attendanceRate >= 90 ? "text-emerald-600" : attendanceRate >= 80 ? "text-amber-600" : "text-red-600",
      bg: attendanceRate >= 90 ? "bg-emerald-50" : attendanceRate >= 80 ? "bg-amber-50" : "bg-red-50",
    },
    {
      label: "Enrolled Classes",
      value: classCount.toString(),
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Upcoming Exams",
      value: upcomingExams.toString(),
      icon: GraduationCap,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{stat.label}</p>
              <div className={cn("rounded-lg p-2", stat.bg)}>
                <Icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
