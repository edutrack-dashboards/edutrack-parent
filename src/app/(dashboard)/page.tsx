import { DashboardGreeting } from "@/components/dashboard/greeting";
import { StatCards } from "@/components/dashboard/stat-cards";
import { TodaySchedule } from "@/components/dashboard/today-schedule";
import { UpcomingExams } from "@/components/dashboard/upcoming-exams";
import { RecentGrades } from "@/components/dashboard/recent-grades";
import { ChildSelector } from "@/components/layout/child-selector";
import { NoChildrenState } from "@/components/layout/no-children-state";
import {
  resolveParentContext,
  getChildClasses,
  getChildAverageGrade,
  getChildAttendanceRate,
  getChildUpcomingExams,
  getChildTodaySchedule,
  getChildGrades,
  getClassById,
} from "@/lib/db";
import { getPersonFullName } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const params = await searchParams;
  const { parent, children, selectedChild } = await resolveParentContext(params.child);

  if (!selectedChild) {
    return <NoChildrenState />;
  }

  const [classes, averageGrade, attendanceRate, upcomingExams, todaySchedule, allGrades] =
    await Promise.all([
      getChildClasses(selectedChild.id),
      getChildAverageGrade(selectedChild.id),
      getChildAttendanceRate(selectedChild.id),
      getChildUpcomingExams(selectedChild.id),
      getChildTodaySchedule(selectedChild.id),
      getChildGrades(selectedChild.id),
    ]);

  const scheduleWithClasses = await Promise.all(
    todaySchedule.map(async (item) => {
      const cls = await getClassById(item.classId);
      return {
        ...item,
        className: cls?.name ?? "",
        classRoom: cls?.room ?? "",
        subject: cls?.subject ?? "",
      };
    })
  );

  const upcomingExamsDisplay = await Promise.all(
    upcomingExams.slice(0, 5).map(async (exam) => {
      const cls = await getClassById(exam.classId);
      return {
        id: exam.id,
        name: exam.name,
        date: exam.date,
        type: exam.type,
        className: cls?.name ?? "",
      };
    })
  );

  const supabase = await createClient();
  const recentGradesDisplay = await Promise.all(
    allGrades
      .filter((grade) => grade.score !== null && grade.letterGrade !== null)
      .slice(0, 5)
      .map(async (grade) => {
        const cls = await getClassById(grade.classId);
        const { data: exam } = await supabase
          .from("exams")
          .select("name, date, max_score")
          .eq("id", grade.examId)
          .single();

        return {
          id: grade.id,
          examName: exam?.name ?? "Exam",
          className: cls?.name ?? "",
          score: grade.score!,
          maxScore: (exam?.max_score as number) ?? 100,
          letterGrade: grade.letterGrade!,
          date: (exam?.date as string) ?? "",
        };
      })
  );

  const childName = getPersonFullName(selectedChild.firstName, selectedChild.lastName);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <DashboardGreeting parentName={parent.name} childName={childName} />
        <ChildSelector
          selectedChildId={selectedChild.id}
          options={children.map((child) => ({
            id: child.id,
            name: getPersonFullName(child.firstName, child.lastName),
            grade: child.grade,
          }))}
        />
      </div>

      <StatCards
        gpa={averageGrade}
        attendanceRate={attendanceRate}
        classCount={classes.length}
        upcomingExams={upcomingExams.length}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <TodaySchedule items={scheduleWithClasses} childId={selectedChild.id} />
        <UpcomingExams exams={upcomingExamsDisplay} childId={selectedChild.id} />
      </div>

      <RecentGrades grades={recentGradesDisplay} childId={selectedChild.id} />
    </div>
  );
}
