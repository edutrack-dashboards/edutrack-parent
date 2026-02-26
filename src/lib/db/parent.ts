import { createClient } from "@/lib/supabase/server";
import type { ParentContext, ParentProfile, Student } from "@/lib/types";

function mapStudentRow(row: Record<string, unknown>): Student {
  const classStudents = (row.class_students ?? []) as { class_id: string }[];
  return {
    id: row.id as string,
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    email: row.email as string,
    avatar: (row.avatar_url as string) ?? undefined,
    grade: row.grade as string,
    classIds: classStudents.map((cs) => cs.class_id),
    parentName: row.parent_name as string,
    parentPhone: (row.parent_phone as string) ?? "",
    parentEmail: row.parent_email as string,
    enrollmentDate: row.enrollment_date as string,
  };
}

async function getCurrentAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  return user;
}

function getFallbackParentName(email: string): string {
  return email.split("@")[0]
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function getCurrentParent(): Promise<ParentProfile> {
  const user = await getCurrentAuthUser();
  const email = user.email?.toLowerCase();

  if (!email) {
    throw new Error("No email found for current account");
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("students")
    .select("parent_name, parent_phone")
    .ilike("parent_email", email)
    .limit(1)
    .maybeSingle();

  return {
    email,
    name: (data?.parent_name as string) || getFallbackParentName(email),
    phone: (data?.parent_phone as string) ?? undefined,
  };
}

export async function getParentChildren(): Promise<Student[]> {
  const user = await getCurrentAuthUser();
  const email = user.email?.toLowerCase();

  if (!email) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*, class_students(class_id)")
    .ilike("parent_email", email)
    .order("last_name")
    .order("first_name");

  if (error) throw error;
  return (data ?? []).map(mapStudentRow);
}

export async function getChildById(childId: string): Promise<Student | null> {
  const user = await getCurrentAuthUser();
  const email = user.email?.toLowerCase();
  if (!email) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*, class_students(class_id)")
    .eq("id", childId)
    .ilike("parent_email", email)
    .maybeSingle();

  if (error || !data) return null;
  return mapStudentRow(data);
}

export async function resolveParentContext(preferredChildId?: string): Promise<ParentContext> {
  const [parent, children] = await Promise.all([
    getCurrentParent(),
    getParentChildren(),
  ]);

  if (children.length === 0) {
    return {
      parent,
      children: [],
      selectedChild: null,
    };
  }

  const selectedChild = preferredChildId
    ? children.find((child) => child.id === preferredChildId) ?? children[0]
    : children[0];

  return {
    parent,
    children,
    selectedChild,
  };
}
