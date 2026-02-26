import { AttendanceView } from "@/components/attendance/attendance-view";
import { ChildSelector } from "@/components/layout/child-selector";
import { NoChildrenState } from "@/components/layout/no-children-state";
import {
  resolveParentContext,
  getChildAttendance,
  getChildAttendanceRate,
  getChildClasses,
  getClassById,
} from "@/lib/db";
import { getPersonFullName } from "@/lib/utils";

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const params = await searchParams;
  const { children, selectedChild } = await resolveParentContext(params.child);

  if (!selectedChild) {
    return <NoChildrenState />;
  }

  const [records, overallRate, classes] = await Promise.all([
    getChildAttendance(selectedChild.id),
    getChildAttendanceRate(selectedChild.id),
    getChildClasses(selectedChild.id),
  ]);

  const recordsWithClass = await Promise.all(
    records.map(async (record) => {
      const cls = await getClassById(record.classId);
      return {
        ...record,
        className: cls?.name ?? "Unknown",
      };
    })
  );

  const classRates = classes.map((cls) => {
    const classRecords = records.filter((record) => record.classId === cls.id);
    const total = classRecords.length;
    const presentOrLate = classRecords.filter(
      (record) => record.status === "present" || record.status === "late"
    ).length;
    const rate = total > 0 ? Math.round((presentOrLate / total) * 100) : 100;

    return {
      classId: cls.id,
      className: cls.name,
      rate,
      total,
      present: classRecords.filter((record) => record.status === "present").length,
      absent: classRecords.filter((record) => record.status === "absent").length,
      late: classRecords.filter((record) => record.status === "late").length,
      excused: classRecords.filter((record) => record.status === "excused").length,
    };
  });

  const summary = {
    total: records.length,
    present: records.filter((record) => record.status === "present").length,
    absent: records.filter((record) => record.status === "absent").length,
    late: records.filter((record) => record.status === "late").length,
    excused: records.filter((record) => record.status === "excused").length,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
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
      <AttendanceView
        records={recordsWithClass}
        overallRate={overallRate}
        classRates={classRates}
        summary={summary}
      />
    </div>
  );
}
