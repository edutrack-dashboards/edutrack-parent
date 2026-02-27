import Link from "next/link";
import { BookOpen, ClipboardCheck, GraduationCap, Users } from "lucide-react";
import {
  getCurrentParent,
  getParentChildren,
  getChildAverageGrade,
  getChildAttendanceRate,
  getChildUpcomingExams,
} from "@/lib/db";
import { getPersonFullName } from "@/lib/utils";
import { NoChildrenState } from "@/components/layout/no-children-state";

export default async function ChildrenPage() {
  const parent = await getCurrentParent();
  const children = await getParentChildren(parent.email);

  if (children.length === 0) {
    return <NoChildrenState />;
  }

  const childrenWithStats = await Promise.all(
    children.map(async (child) => {
      const [averageGrade, attendanceRate, upcomingExams] = await Promise.all([
        getChildAverageGrade(child.id),
        getChildAttendanceRate(child.id),
        getChildUpcomingExams(child.id),
      ]);

      return {
        ...child,
        averageGrade,
        attendanceRate,
        upcomingExamCount: upcomingExams.length,
      };
    })
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Linked Children</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {childrenWithStats.map((child) => {
          const childName = getPersonFullName(child.firstName, child.lastName);

          return (
            <div key={child.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{childName}</h3>
                  <p className="text-sm text-gray-500">Grade {child.grade}</p>
                </div>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  {child.classIds.length} classes
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="mb-1 flex items-center gap-1 text-gray-500">
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span className="text-xs">Avg Grade</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {child.averageGrade !== null ? `${child.averageGrade}%` : "N/A"}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="mb-1 flex items-center gap-1 text-gray-500">
                    <ClipboardCheck className="h-3.5 w-3.5" />
                    <span className="text-xs">Attendance</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{child.attendanceRate}%</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="mb-1 flex items-center gap-1 text-gray-500">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span className="text-xs">Upcoming Exams</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{child.upcomingExamCount}</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <div className="mb-1 flex items-center gap-1 text-gray-500">
                    <Users className="h-3.5 w-3.5" />
                    <span className="text-xs">Student Email</span>
                  </div>
                  <p className="truncate text-xs font-medium text-gray-700">{child.email}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/?child=${child.id}`}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                >
                  View Dashboard
                </Link>
                <Link
                  href={`/grades?child=${child.id}`}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Grades
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
