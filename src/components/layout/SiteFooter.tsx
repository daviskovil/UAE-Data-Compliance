import Link from "next/link";
import { db } from "@/data";
import { footerLinks, site } from "@/lib/site";
import { getFrameworks } from "@/lib/content";
import { LogoMark } from "@/components/ui/Logo";

export async function SiteFooter() {
  const vendorCount = await db.countVendors();
  const frameworkCount = getFrameworks().length;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-8 w-8" />
              <span className="text-sm font-bold text-ink">{site.name}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {site.tagline}
            </p>
            <p className="mt-4 text-xs text-muted">
              {vendorCount} vendor{vendorCount === 1 ? "" : "s"} listed &middot;{" "}
              {frameworkCount} frameworks covered
            </p>
          </div>

          {footerLinks.map((column) => (
            <div key={column.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-ink">
                {column.heading}
              </h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-brand-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <p className="text-xs leading-relaxed text-muted">
            &copy; {year} {site.name}. Information on this site is general in
            nature and is not legal advice. It does not create a
            client relationship and should not be relied on for compliance
            decisions.
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            <Link href="/privacy" className="hover:text-brand-700">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-brand-700">
              Terms of Use
            </Link>
            <Link href="/vendors/submit" className="hover:text-brand-700">
              List your company
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
