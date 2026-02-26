import { signOut } from "@/app/actions/auth";
import { ChildSelector } from "@/components/layout/child-selector";
import { NoChildrenState } from "@/components/layout/no-children-state";
import {
  resolveParentContext,
  getChildClasses,
  getChildAverageGrade,
  getChildAttendanceRate,
} from "@/lib/db";
import { formatDate, getInitials, getPersonFullName } from "@/lib/utils";
import {
  Calendar,
  ClipboardCheck,
  GraduationCap,
  Mail,
  Phone,
  User,
} from "lucide-react";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const params = await searchParams;
  const { parent, children, selectedChild } = await resolveParentContext(params.child);

  if (!selectedChild) {
    return <NoChildrenState />;
  }

  const [classes, averageGrade, attendanceRate] = await Promise.all([
    getChildClasses(selectedChild.id),
    getChildAverageGrade(selectedChild.id),
    getChildAttendanceRate(selectedChild.id),
  ]);

  const initials = getInitials(parent.name, parent.name);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <ChildSelector
          selectedChildId={selectedChild.id}
          options={children.map((child) => ({
            id: child.id,
            name: getPersonFullName(child.firstName, child.lastName),
            grade: child.grade,
          }))}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-gray-900">{parent.name}</h2>
            <p className="text-sm text-gray-500">Parent Account</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-gray-400" />
                {parent.email}
              </span>
              {parent.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {parent.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Selected Child</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {getPersonFullName(selectedChild.firstName, selectedChild.lastName)}
          </p>
          <p className="text-xs text-gray-500">Grade {selectedChild.grade}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-2 flex items-center gap-2 text-gray-500">
            <GraduationCap className="h-4 w-4" />
            <span className="text-sm">Average Grade</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {averageGrade !== null ? `${averageGrade}%` : "N/A"}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-2 flex items-center gap-2 text-gray-500">
            <ClipboardCheck className="h-4 w-4" />
            <span className="text-sm">Attendance</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{attendanceRate}%</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Child Details</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-gray-600">
            <User className="h-4 w-4 text-gray-400" />
            <span>{getPersonFullName(selectedChild.firstName, selectedChild.lastName)}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Mail className="h-4 w-4 text-gray-400" />
            <span>{selectedChild.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>Enrolled {formatDate(selectedChild.enrollmentDate)}</span>
          </div>
        </div>
      </div>

      {classes.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-900">Current Classes</h3>
          <div className="divide-y divide-gray-100">
            {classes.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{cls.name}</p>
                  <p className="text-xs text-gray-500">
                    {cls.subject} &middot; {cls.teacherName}
                  </p>
                </div>
                <span className="text-xs text-gray-400">Room {cls.room}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <form action={signOut}>
        <button
          type="submit"
          className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
