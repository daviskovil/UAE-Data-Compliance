export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-muted ${className}`}
    >
      <strong className="font-semibold text-ink">
        This is general information, not legal advice.
      </strong>{" "}
      Frameworks and their obligations change. Consult a licensed professional
      about your specific situation before acting.
    </p>
  );
}
