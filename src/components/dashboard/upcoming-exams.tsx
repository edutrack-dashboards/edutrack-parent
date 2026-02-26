import { FileText } from "lucide-react";
import { formatDate, getExamTypeLabel, getExamTypeColor, cn } from "@/lib/utils";
import Link from "next/link";

interface ExamDisplay {
  id: string;
  name: string;
  date: string;
  type: string;
  className: string;
}

export function UpcomingExams({
  exams,
  childId,
}: {
  exams: ExamDisplay[];
  childId?: string;
}) {
  const gradesHref = childId ? `/grades?child=${childId}` : "/grades";

  if (exams.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Upcoming Exams</h3>
          <Link href={gradesHref} className="text-sm text-blue-600 hover:text-blue-700">
            All grades
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <FileText className="mb-2 h-8 w-8" />
          <p className="text-sm">No upcoming exams</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Upcoming Exams</h3>
        <Link href={gradesHref} className="text-sm text-blue-600 hover:text-blue-700">
          All grades
        </Link>
      </div>
      <div className="space-y-3">
        {exams.slice(0, 5).map((exam) => (
          <div
            key={exam.id}
            className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">{exam.name}</p>
              <p className="text-xs text-gray-500">{exam.className}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", getExamTypeColor(exam.type))}>
                {getExamTypeLabel(exam.type)}
              </span>
              <span className="text-xs text-gray-500">{formatDate(exam.date)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
