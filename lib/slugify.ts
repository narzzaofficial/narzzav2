// lib/slugify.ts

/**
 * Generate URL-friendly slug from title + ID
 * 
 * @param title - Article title (e.g., "Belajar React dari Nol!")
 * @param id - Unique ID number
 * @returns slug (e.g., "belajar-react-dari-nol-5")
 */
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

/**
 * Parse ID from slug
 * 
 * @param slug - Slug string (e.g., "belajar-react-5")
 * @returns ID number or null if not found
 */
export function parseSlugId(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}