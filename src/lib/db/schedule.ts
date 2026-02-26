import { createClient } from "@/lib/supabase/server";
import type { ScheduleItem } from "@/lib/types";
import { getChildById } from "./parent";

function mapRow(row: Record<string, unknown>): ScheduleItem {
  return {
    id: row.id as string,
    classId: row.class_id as string,
    period: row.period as number,
    startTime: (row.start_time as string).slice(0, 5),
    endTime: (row.end_time as string).slice(0, 5),
    dayOfWeek: row.day_of_week as number,
  };
}

export async function getChildScheduleForDay(
  childId: string,
  dayOfWeek: number
): Promise<ScheduleItem[]> {
  const child = await getChildById(childId);
  if (!child || child.classIds.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schedule_items")
    .select("*")
    .in("class_id", child.classIds)
    .eq("day_of_week", dayOfWeek)
    .order("period");

  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function getChildTodaySchedule(childId: string): Promise<ScheduleItem[]> {
  const today = new Date().getDay();
  return getChildScheduleForDay(childId, today);
}

export async function getChildWeekSchedule(childId: string): Promise<ScheduleItem[]> {
  const child = await getChildById(childId);
  if (!child || child.classIds.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schedule_items")
    .select("*")
    .in("class_id", child.classIds)
    .order("day_of_week")
    .order("period");

  if (error) throw error;
  return (data ?? []).map(mapRow);
}
