"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/children": "My Children",
  "/grades": "Grade Progress",
  "/attendance": "Attendance",
  "/schedule": "Schedule",
  "/profile": "Parent Profile",
};

export function Header() {
  const pathname = usePathname();

  const title = pageTitles[pathname] || "EduTrack Parent";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-white px-4 md:px-6">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <span className="hidden text-sm text-gray-500 sm:block">{today}</span>
    </header>
  );
}
