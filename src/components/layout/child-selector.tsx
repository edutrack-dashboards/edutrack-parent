"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Users } from "lucide-react";

interface ChildOption {
  id: string;
  name: string;
  grade: string;
}

interface ChildSelectorProps {
  options: ChildOption[];
  selectedChildId: string;
}

export function ChildSelector({ options, selectedChildId }: ChildSelectorProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortedOptions = useMemo(
    () => [...options].sort((a, b) => a.name.localeCompare(b.name)),
    [options]
  );

  function handleChange(childId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("child", childId);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-500">
        <Users className="h-3.5 w-3.5" />
        Child
      </div>
      <select
        value={selectedChildId}
        onChange={(event) => handleChange(event.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {sortedOptions.map((child) => (
          <option key={child.id} value={child.id}>
            {child.name} (Grade {child.grade})
          </option>
        ))}
      </select>
    </div>
  );
}
