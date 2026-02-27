"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentParent } from "@/lib/db";

export async function sendParentReply(messageId: string, content: string) {
  const supabase = await createClient();
  const parent = await getCurrentParent();

  const { error: itemError } = await supabase
    .from("message_items")
    .insert({
      message_id: messageId,
      sender_name: parent.name,
      content,
      is_from_teacher: false,
      sender_role: "parent",
    });

  if (itemError) throw new Error(itemError.message);

  const { error: msgError } = await supabase
    .from("messages")
    .update({
      last_message_at: new Date().toISOString(),
      is_read: false,
      is_read_parent: true,
    })
    .eq("id", messageId);

  if (msgError) throw new Error(msgError.message);

  revalidatePath("/messages");
}

export async function createParentMessage(data: {
  studentId: string;
  teacherId: string;
  subject: string;
  content: string;
}) {
  const supabase = await createClient();
  const parent = await getCurrentParent();

  const { data: message, error: msgError } = await supabase
    .from("messages")
    .insert({
      teacher_id: data.teacherId,
      parent_name: parent.name,
      parent_id: parent.id,
      student_id: data.studentId,
      subject: data.subject,
      is_read: false,
      is_read_parent: true,
      last_message_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (msgError) throw new Error(msgError.message);

  const { error: itemError } = await supabase
    .from("message_items")
    .insert({
      message_id: message.id,
      sender_name: parent.name,
      content: data.content,
      is_from_teacher: false,
      sender_role: "parent",
    });

  if (itemError) throw new Error(itemError.message);

  revalidatePath("/messages");
  revalidatePath("/");
}

export async function markParentMessageRead(messageId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("messages")
    .update({ is_read_parent: true })
    .eq("id", messageId);

  if (error) throw new Error(error.message);

  revalidatePath("/messages");
}
