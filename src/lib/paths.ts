const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a root-relative public asset path with the GitHub Pages base path. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
