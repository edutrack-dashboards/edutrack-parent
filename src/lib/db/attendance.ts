import { createClient } from "@/lib/supabase/server";
import type { AttendanceRecord } from "@/lib/types";
import { getChildById } from "./parent";

function mapRow(row: Record<string, unknown>): AttendanceRecord {
  return {
    id: row.id as string,
    studentId: row.student_id as string,
    classId: row.class_id as string,
    date: row.date as string,
    status: row.status as AttendanceRecord["status"],
    note: (row.note as string) ?? undefined,
  };
}

export async function getChildAttendance(childId: string): Promise<AttendanceRecord[]> {
  const child = await getChildById(childId);
  if (!child) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", child.id)
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getChildAttendanceByClass(
  childId: string,
  classId: string
): Promise<AttendanceRecord[]> {
  const child = await getChildById(childId);
  if (!child) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("student_id", child.id)
    .eq("class_id", classId)
    .order("date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getChildAttendanceRate(childId: string): Promise<number> {
  const records = await getChildAttendance(childId);
  if (records.length === 0) return 100;
  const present = records.filter(
    (r) => r.status === "present" || r.status === "late"
  ).length;
  return Math.round((present / records.length) * 100);
}

export async function getChildAttendanceRateByClass(
  childId: string,
  classId: string
): Promise<number> {
  const records = await getChildAttendanceByClass(childId, classId);
  if (records.length === 0) return 100;
  const present = records.filter(
    (r) => r.status === "present" || r.status === "late"
  ).length;
  return Math.round((present / records.length) * 100);
}
