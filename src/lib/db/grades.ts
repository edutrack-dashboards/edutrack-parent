import { createClient } from "@/lib/supabase/server";
import type { GradeEntry } from "@/lib/types";
import { getChildById } from "./parent";

function mapRow(row: Record<string, unknown>): GradeEntry {
  return {
    id: row.id as string,
    studentId: row.student_id as string,
    examId: row.exam_id as string,
    classId: row.class_id as string,
    score: row.score as number | null,
    letterGrade: row.letter_grade as GradeEntry["letterGrade"],
    isPublished: row.is_published as boolean,
  };
}

export async function getChildGrades(childId: string): Promise<GradeEntry[]> {
  const child = await getChildById(childId);
  if (!child) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("grade_entries")
    .select("*")
    .eq("student_id", child.id)
    .eq("is_published", true);

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getChildGradesByClass(childId: string, classId: string): Promise<GradeEntry[]> {
  const child = await getChildById(childId);
  if (!child) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("grade_entries")
    .select("*")
    .eq("student_id", child.id)
    .eq("class_id", classId)
    .eq("is_published", true);

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getChildAverageGrade(childId: string, classId?: string): Promise<number | null> {
  const child = await getChildById(childId);
  if (!child) return null;

  const supabase = await createClient();

  let query = supabase
    .from("grade_entries")
    .select("score, exams(max_score)")
    .eq("student_id", child.id)
    .eq("is_published", true)
    .not("score", "is", null);

  if (classId) query = query.eq("class_id", classId);

  const { data, error } = await query;
  if (error) throw error;
  if (!data || data.length === 0) return null;

  let totalPct = 0;
  for (const entry of data) {
    const exam = entry.exams as unknown as { max_score: number };
    totalPct += ((entry.score as number) / exam.max_score) * 100;
  }
  return Math.round(totalPct / data.length);
}
