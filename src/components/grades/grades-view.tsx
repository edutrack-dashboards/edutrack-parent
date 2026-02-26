"use client";

import { useState } from "react";
import { GraduationCap, ChevronDown, ChevronUp } from "lucide-react";
import {
  cn,
  getGradeColor,
  getGradeBgColor,
  getExamTypeLabel,
  getExamTypeColor,
  formatDate,
  calculateLetterGrade,
} from "@/lib/utils";
import type { GradeLetter } from "@/lib/types";

interface GradeDisplay {
  id: string;
  examName: string;
  examDate: string;
  examType: string;
  score: number | null;
  maxScore: number;
  letterGrade: GradeLetter | null;
}

interface ClassGrades {
  classId: string;
  className: string;
  classSubject: string;
  teacherName: string;
  average: number | null;
  grades: GradeDisplay[];
}

export function GradesView({ gradesByClass }: { gradesByClass: ClassGrades[] }) {
  const [expandedClass, setExpandedClass] = useState<string | null>(
    gradesByClass.length > 0 ? gradesByClass[0].classId : null
  );

  if (gradesByClass.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16">
        <GraduationCap className="mb-3 h-12 w-12 text-gray-300" />
        <p className="text-lg font-medium text-gray-500">No grades yet</p>
        <p className="mt-1 text-sm text-gray-400">
          Grades will appear here once published
        </p>
      </div>
    );
  }

  // Overall GPA
  const classesWithGrades = gradesByClass.filter((c) => c.average !== null);
  const overallGPA =
    classesWithGrades.length > 0
      ? Math.round(
          classesWithGrades.reduce((sum, c) => sum + c.average!, 0) /
            classesWithGrades.length
        )
      : null;

  return (
    <div className="space-y-6">
      {/* Overall GPA Card */}
      {overallGPA !== null && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overall Average</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{overallGPA}%</p>
            </div>
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold",
                getGradeBgColor(calculateLetterGrade(overallGPA, 100)),
                getGradeColor(calculateLetterGrade(overallGPA, 100)),
              )}
            >
              {calculateLetterGrade(overallGPA, 100)}
            </div>
          </div>
        </div>
      )}

      {/* Per-class grades */}
      <div className="space-y-3">
        {gradesByClass.map((classData) => {
          const isExpanded = expandedClass === classData.classId;
          const letterGrade =
            classData.average !== null
              ? calculateLetterGrade(classData.average, 100)
              : null;

          return (
            <div
              key={classData.classId}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedClass(isExpanded ? null : classData.classId)
                }
                className="flex w-full items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">
                    {classData.className}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {classData.classSubject} &middot; {classData.teacherName}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {classData.average !== null && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">
                        {classData.average}%
                      </p>
                      <span
                        className={cn(
                          "text-xs font-bold",
                          getGradeColor(letterGrade),
                        )}
                      >
                        {letterGrade}
                      </span>
                    </div>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100">
                  {classData.grades.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-400">
                      No grades published yet
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {classData.grades.map((grade) => (
                        <div
                          key={grade.id}
                          className="flex items-center justify-between px-5 py-3"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {grade.examName}
                              </p>
                              <span
                                className={cn(
                                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                                  getExamTypeColor(grade.examType),
                                )}
                              >
                                {getExamTypeLabel(grade.examType)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              {formatDate(grade.examDate)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {grade.score !== null ? (
                              <>
                                <span className="text-sm text-gray-600">
                                  {grade.score}/{grade.maxScore}
                                </span>
                                <span
                                  className={cn(
                                    "rounded-full px-2.5 py-0.5 text-xs font-bold",
                                    getGradeColor(grade.letterGrade),
                                    getGradeBgColor(grade.letterGrade),
                                  )}
                                >
                                  {grade.letterGrade}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm text-gray-400">
                                Not graded
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
