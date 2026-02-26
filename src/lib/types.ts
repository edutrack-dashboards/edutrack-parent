export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export type GradeLetter = "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D+" | "D" | "F";

export interface ParentProfile {
  email: string;
  name: string;
  phone?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  grade: string;
  classIds: string[];
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  enrollmentDate: string;
}

export interface Class {
  id: string;
  name: string;
  subject: string;
  grade: string;
  room: string;
  teacherName: string;
  studentCount: number;
}

export interface ScheduleItem {
  id: string;
  classId: string;
  period: number;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0=Sun, 1=Mon, ...
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
}

export interface Exam {
  id: string;
  classId: string;
  name: string;
  date: string;
  maxScore: number;
  type: "quiz" | "test" | "midterm" | "final" | "homework" | "project";
  isPublished: boolean;
}

export interface GradeEntry {
  id: string;
  studentId: string;
  examId: string;
  classId: string;
  score: number | null;
  letterGrade: GradeLetter | null;
  isPublished: boolean;
}

export interface ParentContext {
  parent: ParentProfile;
  children: Student[];
  selectedChild: Student | null;
}
