import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getCurrentParent } from "@/lib/db";
import { getUnreadParentMessageCount } from "@/lib/db/messages";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [parent, unreadCount] = await Promise.all([
    getCurrentParent(),
    getUnreadParentMessageCount(),
  ]);

  return (
    <DashboardShell parentName={parent.name} unreadCount={unreadCount}>
      {children}
    </DashboardShell>
  );
}
