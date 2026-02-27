"use client";

import { useState } from "react";
import { NewMessageModal } from "./new-message-modal";
import { getRelativeTime } from "@/lib/utils";
import { ArrowLeft, MessageSquare, Plus, Send } from "lucide-react";
import type { Message, MessageItem, Student, Teacher } from "@/lib/types";
import { sendParentReply, markParentMessageRead } from "@/app/actions/messages";

interface MessagesClientProps {
  initialMessages: Message[];
  parentName: string;
  children: Student[];
  teachersByChild: Record<string, Teacher[]>;
}

export function MessagesClient({
  initialMessages,
  parentName,
  children,
  teachersByChild,
}: MessagesClientProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState(initialMessages);
  const [reply, setReply] = useState("");
  const [showNewMessage, setShowNewMessage] = useState(false);

  const selectedMessage = localMessages.find((m) => m.id === selectedId);

  function handleSelectMessage(id: string) {
    setSelectedId(id);
    const msg = localMessages.find((m) => m.id === id);
    if (msg && !msg.isRead) {
      setLocalMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
      );
      markParentMessageRead(id);
    }
  }

  async function handleSendReply() {
    if (!reply.trim() || !selectedId) return;
    const newItem: MessageItem = {
      id: `mt-${Date.now()}`,
      senderName: parentName,
      content: reply.trim(),
      sentAt: new Date().toISOString(),
      isFromTeacher: false,
    };
    setLocalMessages((prev) =>
      prev.map((m) =>
        m.id === selectedId
          ? { ...m, thread: [...m.thread, newItem], isRead: true }
          : m
      )
    );
    setReply("");
    await sendParentReply(selectedId, reply.trim());
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] overflow-hidden rounded-xl border border-border bg-white">
      {/* Message List */}
      <div
        className={`w-full flex-col border-r border-border md:flex md:w-80 ${
          selectedId ? "hidden" : "flex"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">Messages</h3>
          <button
            onClick={() => setShowNewMessage(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> New
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {localMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-gray-400">
              <MessageSquare className="h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm">No messages yet</p>
            </div>
          )}
          {localMessages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => handleSelectMessage(msg.id)}
              className={`w-full cursor-pointer border-b border-border px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                selectedId === msg.id ? "bg-blue-50" : ""
              } ${!msg.isRead ? "bg-blue-50/50" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  {msg.teacherName}
                </span>
                <span className="text-xs text-gray-400">
                  {getRelativeTime(msg.lastMessageAt)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-gray-500">{msg.studentName}</p>
              <p className="mt-1 text-xs font-medium text-gray-700">{msg.subject}</p>
              <p className="mt-0.5 truncate text-xs text-gray-500">{msg.preview}</p>
              {!msg.isRead && (
                <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                  New
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Thread View */}
      <div
        className={`flex-1 flex-col ${
          selectedId ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedMessage ? (
          <>
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <button
                onClick={() => setSelectedId(null)}
                className="cursor-pointer rounded-lg p-1 text-gray-500 hover:bg-gray-100 md:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {selectedMessage.subject}
                </p>
                <p className="text-xs text-gray-500">
                  with {selectedMessage.teacherName} (re: {selectedMessage.studentName})
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {selectedMessage.thread.map((item) => (
                <div
                  key={item.id}
                  className={`flex ${item.isFromTeacher ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                      item.isFromTeacher
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    <p className="text-sm">{item.content}</p>
                    <p
                      className={`mt-1 text-xs ${
                        item.isFromTeacher ? "text-gray-400" : "text-blue-200"
                      }`}
                    >
                      {item.senderName} &middot; {getRelativeTime(item.sentAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                  placeholder="Type a reply..."
                  className="h-11 flex-1 rounded-lg border border-gray-300 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  onClick={handleSendReply}
                  disabled={!reply.trim()}
                  className="inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm">Select a conversation</p>
            </div>
          </div>
        )}
      </div>

      <NewMessageModal
        isOpen={showNewMessage}
        onClose={() => setShowNewMessage(false)}
        children={children}
        teachersByChild={teachersByChild}
      />
    </div>
  );
}
