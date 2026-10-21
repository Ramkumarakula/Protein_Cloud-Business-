import { siteConfig } from "@/config/site";
import { withBasePath } from "@/lib/paths";

export function Footer() {
  const social = Object.entries(siteConfig.social).filter(([, url]) => url);
  return (
    <footer className="px-4 pt-10 pb-12 sm:px-8">
      <div className="border-ink/10 mx-auto flex max-w-6xl flex-col gap-6 border-t pt-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <img src={withBasePath("/logo.svg")} alt="" width={32} height={32} className="size-8" />
          <div>
            <p className="font-display font-extrabold">{siteConfig.name}</p>
            <p className="text-muted text-xs">
              {siteConfig.tagline} {siteConfig.location.area}, {siteConfig.location.city}.
            </p>
          </div>
        </div>
        <nav aria-label="Footer">
          <ul className="text-muted flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {siteConfig.nav.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
            {social.map(([name, url]) => (
              <li key={name}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink capitalize"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-muted text-xs">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
