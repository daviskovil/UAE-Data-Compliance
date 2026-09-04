import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="py-24">
      <div className="mx-auto max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
          404
        </p>
        <h1 className="mt-2 text-2xl font-bold text-ink">Page not found</h1>
        <p className="mt-3 text-muted">
          That page does not exist. Try the frameworks index or the vendor
          directory.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <ButtonLink href="/frameworks" variant="outline" size="sm">
            Frameworks
          </ButtonLink>
          <ButtonLink href="/directory" size="sm">
            Directory
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
