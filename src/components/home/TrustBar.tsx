export function TrustBar({
  vendorCount,
  frameworkCount,
  verifiedCount,
}: {
  vendorCount: number;
  frameworkCount: number;
  verifiedCount: number;
}) {
  const stats = [
    { value: frameworkCount, label: "Frameworks explained" },
    { value: vendorCount, label: "Vendors listed" },
    { value: verifiedCount, label: "Verified vendors" },
    { value: "Free", label: "Compliance checker" },
  ];

  return (
    <div className="border-b border-line bg-surface">
      <div className="container-page grid grid-cols-2 divide-x divide-line md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-6 text-center">
            <div className="text-2xl font-bold text-ink">{stat.value}</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
