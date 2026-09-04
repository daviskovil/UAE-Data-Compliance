import { ButtonLink } from "@/components/ui/Button";

export function Hero({ vendorCount }: { vendorCount: number }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_30rem_at_75%_-10%,var(--color-brand-50),transparent)]"
      />
      <div className="container-page relative py-16 sm:py-20 lg:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-mint-600" />
            PDPL &middot; TDRA/CCRF &middot; NESA &middot; DESC &middot; CBUAE
            &middot; Health data
          </span>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
            Which UAE data laws apply to your business?
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Plain-English explainers of every major UAE data protection and
            residency framework, a free checker that tells you which ones likely
            apply, and a directory of verified vendors who can help you comply.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/checker" variant="accent" size="lg">
              Take the free compliance checker
            </ButtonLink>
            <ButtonLink href="/directory" variant="outline" size="lg">
              Browse the vendor directory
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-muted">
            No sign-up. {vendorCount} vendors listed and growing.
          </p>
        </div>
      </div>
    </section>
  );
}
