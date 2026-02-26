import { type AttendanceStatus, type GradeLetter } from "./types";

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDateShort(timestamp.split("T")[0]);
}

export function calculateLetterGrade(score: number, maxScore: number): GradeLetter {
  const pct = (score / maxScore) * 100;
  if (pct >= 97) return "A+";
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C-";
  if (pct >= 67) return "D+";
  if (pct >= 60) return "D";
  return "F";
}

export function getGradeColor(grade: GradeLetter | null): string {
  if (!grade) return "text-gray-400";
  if (grade.startsWith("A")) return "text-emerald-600";
  if (grade.startsWith("B")) return "text-blue-600";
  if (grade.startsWith("C")) return "text-amber-600";
  if (grade.startsWith("D")) return "text-orange-600";
  return "text-red-600";
}

export function getGradeBgColor(grade: GradeLetter | null): string {
  if (!grade) return "bg-gray-100";
  if (grade.startsWith("A")) return "bg-emerald-50";
  if (grade.startsWith("B")) return "bg-blue-50";
  if (grade.startsWith("C")) return "bg-amber-50";
  if (grade.startsWith("D")) return "bg-orange-50";
  return "bg-red-50";
}

export function getAttendanceColor(status: AttendanceStatus): string {
  switch (status) {
    case "present": return "bg-emerald-500";
    case "absent": return "bg-red-500";
    case "late": return "bg-amber-500";
    case "excused": return "bg-blue-500";
  }
}

export function getAttendanceTextColor(status: AttendanceStatus): string {
  switch (status) {
    case "present": return "text-emerald-600";
    case "absent": return "text-red-600";
    case "late": return "text-amber-600";
    case "excused": return "text-blue-600";
  }
}

export function getAttendanceBgColor(status: AttendanceStatus): string {
  switch (status) {
    case "present": return "bg-emerald-50";
    case "absent": return "bg-red-50";
    case "late": return "bg-amber-50";
    case "excused": return "bg-blue-50";
  }
}

export function getAttendanceLabel(status: AttendanceStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function getPersonFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

export function getInitials(firstName: string, lastName: string): string {
  const first = firstName?.[0] ?? "";
  const last = lastName?.[0] ?? "";
  return `${first}${last}`.toUpperCase() || "P";
}

export function getExamTypeLabel(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function getExamTypeColor(type: string): string {
  switch (type) {
    case "quiz": return "bg-purple-50 text-purple-700";
    case "test": return "bg-blue-50 text-blue-700";
    case "midterm": return "bg-amber-50 text-amber-700";
    case "final": return "bg-red-50 text-red-700";
    case "homework": return "bg-emerald-50 text-emerald-700";
    case "project": return "bg-indigo-50 text-indigo-700";
    default: return "bg-gray-50 text-gray-700";
  }
}

export function getStudentFullName(firstName: string, lastName: string): string {
  return getPersonFullName(firstName, lastName);
}
