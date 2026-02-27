"use client";

import { useState, useTransition } from "react";
import { createParentMessage } from "@/app/actions/messages";
import type { Student, Teacher } from "@/lib/types";

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: Student[];
  teachersByChild: Record<string, Teacher[]>;
}

export function NewMessageModal({
  isOpen,
  onClose,
  children,
  teachersByChild,
}: NewMessageModalProps) {
  const [childId, setChildId] = useState(children[0]?.id ?? "");
  const [teacherId, setTeacherId] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const availableTeachers = teachersByChild[childId] ?? [];

  function handleChildChange(newChildId: string) {
    setChildId(newChildId);
    setTeacherId("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!childId || !teacherId || !subject.trim() || !content.trim()) {
      setError("All fields are required");
      return;
    }

    startTransition(async () => {
      try {
        await createParentMessage({
          studentId: childId,
          teacherId,
          subject: subject.trim(),
          content: content.trim(),
        });
        setChildId(children[0]?.id ?? "");
        setTeacherId("");
        setSubject("");
        setContent("");
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900">New Message</h3>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="child-select" className="text-sm font-medium text-gray-700">
              Child
            </label>
            <select
              id="child-select"
              value={childId}
              onChange={(e) => handleChildChange(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.lastName}, {c.firstName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="teacher-select" className="text-sm font-medium text-gray-700">
              Teacher
            </label>
            <select
              id="teacher-select"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select a teacher</option>
              {availableTeachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} — {t.subject}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="subject-input" className="text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              id="subject-input"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Question about homework"
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="message-content" className="text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your message..."
              rows={4}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
