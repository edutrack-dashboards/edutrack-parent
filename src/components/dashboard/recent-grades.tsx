import { GraduationCap } from "lucide-react";
import { cn, getGradeColor, getGradeBgColor, formatDate } from "@/lib/utils";
import type { GradeLetter } from "@/lib/types";
import Link from "next/link";

interface RecentGradeDisplay {
  id: string;
  examName: string;
  className: string;
  score: number;
  maxScore: number;
  letterGrade: GradeLetter;
  date: string;
}

export function RecentGrades({
  grades,
  childId,
}: {
  grades: RecentGradeDisplay[];
  childId?: string;
}) {
  const gradesHref = childId ? `/grades?child=${childId}` : "/grades";

  if (grades.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Recent Grades</h3>
          <Link href={gradesHref} className="text-sm text-blue-600 hover:text-blue-700">
            All grades
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <GraduationCap className="mb-2 h-8 w-8" />
          <p className="text-sm">No grades yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Recent Grades</h3>
        <Link href={gradesHref} className="text-sm text-blue-600 hover:text-blue-700">
          All grades
        </Link>
      </div>
      <div className="space-y-3">
        {grades.slice(0, 5).map((grade) => (
          <div
            key={grade.id}
            className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">{grade.examName}</p>
              <p className="text-xs text-gray-500">{grade.className} &middot; {formatDate(grade.date)}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm text-gray-600">
                {grade.score}/{grade.maxScore}
              </span>
              <span className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-bold",
                getGradeColor(grade.letterGrade),
                getGradeBgColor(grade.letterGrade),
              )}>
                {grade.letterGrade}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
