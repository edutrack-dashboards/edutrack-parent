import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getCurrentParent } from "@/lib/db";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const parent = await getCurrentParent();

  return (
    <DashboardShell parentName={parent.name}>
      {children}
    </DashboardShell>
  );
}
