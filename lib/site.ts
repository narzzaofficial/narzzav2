export const siteConfig = {
  name: "Narzza Media Digital",
  shortName: "Narzza",
  description:
    "Narzza adalah media digital yang membungkus berita, tutorial, riset, hukum Indonesia, dan kebijakan digital dalam format yang lebih mudah dipahami.",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3000",
  defaultOgImage: "/android-chrome-512x512.png",
  xHandle: "@narzza",
} as const;

export function absoluteUrl(path = "/") {
  const base = siteConfig.siteUrl.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
