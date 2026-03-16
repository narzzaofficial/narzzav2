
export function slugify(title: string, id: number): string {
  const slug = title
    .toLowerCase()
    .trim()
    // Remove special characters (keep letters, numbers, spaces, hyphens)
    .replace(/[^a-z0-9\s-]/g, "")
    // Replace multiple spaces with single dash
    .replace(/\s+/g, "-")
    // Replace multiple dashes with single dash
    .replace(/-+/g, "-")
    // Remove leading/trailing dashes
    .replace(/^-+|-+$/g, "");

  // Append ID untuk ensure uniqueness
  return `${slug}-${id}`;
}

export function parseSlugId(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}