import { createClient } from "@/lib/supabase/server";
import type { Teacher } from "@/lib/types";

export async function getChildTeachers(childId: string): Promise<Teacher[]> {
  const supabase = await createClient();

  // Get class IDs for this child
  const { data: enrollments, error: enrollError } = await supabase
    .from("class_students")
    .select("class_id")
    .eq("student_id", childId);

  if (enrollError) throw enrollError;
  if (!enrollments || enrollments.length === 0) return [];

  const classIds = enrollments.map((e) => e.class_id);

  // Get unique teachers for those classes
  const { data: classes, error: classError } = await supabase
    .from("classes")
    .select("teacher_id, teachers(id, name, email, subject)")
    .in("id", classIds);

  if (classError) throw classError;

  const seen = new Set<string>();
  const teachers: Teacher[] = [];

  for (const cls of classes ?? []) {
    const t = cls.teachers as Record<string, unknown> | null;
    if (!t) continue;
    const id = t.id as string;
    if (seen.has(id)) continue;
    seen.add(id);
    teachers.push({
      id,
      name: t.name as string,
      email: t.email as string,
      subject: t.subject as string,
    });
  }

  return teachers;
}
