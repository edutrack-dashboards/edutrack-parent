import { getParentMessages, getCurrentParent, getParentChildren, getChildTeachers } from "@/lib/db";
import { MessagesClient } from "@/components/messages/messages-client";
import type { Teacher } from "@/lib/types";

export default async function MessagesPage() {
  const [initialMessages, parent, children] = await Promise.all([
    getParentMessages(),
    getCurrentParent(),
    getParentChildren(),
  ]);

  // Fetch teachers for each child in parallel
  const teachersByChild: Record<string, Teacher[]> = {};
  await Promise.all(
    children.map(async (child) => {
      teachersByChild[child.id] = await getChildTeachers(child.id);
    })
  );

  return (
    <div className="mx-auto max-w-5xl">
      <MessagesClient
        initialMessages={initialMessages}
        parentName={parent.name}
        children={children}
        teachersByChild={teachersByChild}
      />
    </div>
  );
}
