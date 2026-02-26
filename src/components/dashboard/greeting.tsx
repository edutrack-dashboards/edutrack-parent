export function DashboardGreeting({
  parentName,
  childName,
}: {
  parentName: string;
  childName: string;
}) {
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  if (hour >= 17) greeting = "Good evening";

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">
        {greeting}, {parentName.split(" ")[0]}
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Here&apos;s {childName.split(" ")[0]}&apos;s learning overview for today.
      </p>
    </div>
  );
}
