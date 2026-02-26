import { ScheduleView } from "@/components/schedule/schedule-view";
import { ChildSelector } from "@/components/layout/child-selector";
import { NoChildrenState } from "@/components/layout/no-children-state";
import {
  resolveParentContext,
  getChildWeekSchedule,
  getClassById,
} from "@/lib/db";
import { getPersonFullName } from "@/lib/utils";

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const params = await searchParams;
  const { children, selectedChild } = await resolveParentContext(params.child);

  if (!selectedChild) {
    return <NoChildrenState />;
  }

  const weekSchedule = await getChildWeekSchedule(selectedChild.id);

  const scheduleWithClasses = await Promise.all(
    weekSchedule.map(async (item) => {
      const cls = await getClassById(item.classId);
      return {
        ...item,
        className: cls?.name ?? "",
        classRoom: cls?.room ?? "",
        subject: cls?.subject ?? "",
      };
    })
  );

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
      <ScheduleView items={scheduleWithClasses} />
    </div>
  );
}
