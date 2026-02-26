import { createClient } from "@/lib/supabase/server";
import type { Exam } from "@/lib/types";
import { getChildById } from "./parent";

function mapRow(row: Record<string, unknown>): Exam {
  return {
    id: row.id as string,
    classId: row.class_id as string,
    name: row.name as string,
    date: row.date as string,
    maxScore: row.max_score as number,
    type: row.type as Exam["type"],
    isPublished: row.is_published as boolean,
  };
}

export async function getChildExams(childId: string): Promise<Exam[]> {
  const child = await getChildById(childId);
  if (!child || child.classIds.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .in("class_id", child.classIds)
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getChildExamsByClass(
  childId: string,
  classId: string
): Promise<Exam[]> {
  const child = await getChildById(childId);
  if (!child || !child.classIds.includes(classId)) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .eq("class_id", classId)
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getChildUpcomingExams(childId: string): Promise<Exam[]> {
  const child = await getChildById(childId);
  if (!child || child.classIds.length === 0) return [];

  const today = new Date().toISOString().split("T")[0];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .in("class_id", child.classIds)
    .gte("date", today)
    .order("date");

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
