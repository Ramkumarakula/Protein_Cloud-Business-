import { siteConfig } from "@/config/site";
import { withBasePath } from "@/lib/paths";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center px-6 text-center">
      <div>
        <p className="text-muted text-xs font-medium">Error 404</p>
        <h1 className="font-display mt-3 leading-[0.9] uppercase">
          <span className="block text-3xl font-light tracking-[0.08em]">EMPTY</span>
          <span className="block text-7xl font-extrabold tracking-[-0.02em]">PLATE</span>
        </h1>
        <p className="text-muted mt-6">This page is not on the menu.</p>
        <a
          href={withBasePath("/")}
          className="bg-ink mt-8 inline-flex rounded-full px-5 py-3 text-sm font-semibold text-white"
        >
          Back to {siteConfig.name}
        </a>
      </div>
    </main>
  );
}
