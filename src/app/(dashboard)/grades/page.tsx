import { GradesView } from "@/components/grades/grades-view";
import { ChildSelector } from "@/components/layout/child-selector";
import { NoChildrenState } from "@/components/layout/no-children-state";
import {
  resolveParentContext,
  getChildClasses,
  getChildGrades,
  getChildAverageGrade,
} from "@/lib/db";
import { getPersonFullName } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export default async function GradesPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const params = await searchParams;
  const { children, selectedChild } = await resolveParentContext(params.child);

  if (!selectedChild) {
    return <NoChildrenState />;
  }

  const [classes, allGrades] = await Promise.all([
    getChildClasses(selectedChild.id),
    getChildGrades(selectedChild.id),
  ]);

  const supabase = await createClient();

  const gradesByClass = await Promise.all(
    classes.map(async (cls) => {
      const classGrades = allGrades.filter((grade) => grade.classId === cls.id);
      const average = await getChildAverageGrade(selectedChild.id, cls.id);

      const grades = await Promise.all(
        classGrades.map(async (grade) => {
          const { data: exam } = await supabase
            .from("exams")
            .select("name, date, max_score, type")
            .eq("id", grade.examId)
            .single();

          return {
            id: grade.id,
            examName: exam?.name ?? "Exam",
            examDate: (exam?.date as string) ?? "",
            examType: (exam?.type as string) ?? "test",
            score: grade.score,
            maxScore: (exam?.max_score as number) ?? 100,
            letterGrade: grade.letterGrade,
          };
        })
      );

      return {
        classId: cls.id,
        className: cls.name,
        classSubject: cls.subject,
        teacherName: cls.teacherName,
        average,
        grades,
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
      <GradesView gradesByClass={gradesByClass} />
    </div>
  );
}
