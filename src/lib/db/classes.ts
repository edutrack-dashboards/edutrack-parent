import { createClient } from "@/lib/supabase/server";
import type { Class } from "@/lib/types";
import { getChildById } from "./parent";

function mapRow(row: Record<string, unknown>): Class {
  const classStudents = (row.class_students ?? []) as { student_id: string }[];
  const teacher = row.teachers as Record<string, unknown> | null;
  return {
    id: row.id as string,
    name: row.name as string,
    subject: row.subject as string,
    grade: row.grade as string,
    room: row.room as string,
    teacherName: teacher ? (teacher.name as string) : "Unknown",
    studentCount: classStudents.length,
  };
}

export async function getChildClasses(childId: string): Promise<Class[]> {
  const child = await getChildById(childId);
  if (!child || child.classIds.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("*, class_students(student_id), teachers(name)")
    .in("id", child.classIds)
    .order("name");

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getClassById(id: string): Promise<Class | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .select("*, class_students(student_id), teachers(name)")
    .eq("id", id)
    .single();

  if (error || !data) return undefined;
  return mapRow(data);
}
