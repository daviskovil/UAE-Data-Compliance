import type { ActionResult } from "@/app/actions";

export function FormStatus({ state }: { state: ActionResult | null }) {
  if (!state) return null;
  return (
    <p
      role="status"
      className={`rounded-lg border px-3 py-2 text-sm ${
        state.ok
          ? "border-mint-100 bg-mint-50 text-mint-700"
          : "border-accent-500/30 bg-accent-500/10 text-accent-600"
      }`}
    >
      {state.message}
    </p>
  );
}
