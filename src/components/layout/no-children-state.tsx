import { UserRoundX } from "lucide-react";
import { signOut } from "@/app/actions/auth";

export function NoChildrenState() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
          <UserRoundX className="h-6 w-6 text-amber-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">No linked students found</h2>
        <p className="mt-2 text-sm text-gray-500">
          This parent account is authenticated, but no student records match this email yet.
          Please ask your school manager to set your email as `parent_email` on your child&apos;s profile.
        </p>
      </div>

      <form action={signOut}>
        <button
          type="submit"
          className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
