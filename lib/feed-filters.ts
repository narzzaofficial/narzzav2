import type { Feed } from "@/types/content";

/**
 * Filter feeds by category with optional limit
 */
export function filterFeedsByCategory(
  feeds: Feed[],
  category: Feed["category"],
  limit?: number
): Feed[] {
  const filtered = feeds.filter((f) => f.category === category);
  return limit ? filtered.slice(0, limit) : filtered;
}

/**
 * Group feeds by category with limits
 */
export function groupFeedsByCategory(
  feeds: Feed[],
  limits: { berita?: number; tutorial?: number; riset?: number } = {}
): {
  berita: Feed[];
  tutorial: Feed[];
  riset: Feed[];
} {
  const result = {
    berita: [] as Feed[],
    tutorial: [] as Feed[],
    riset: [] as Feed[],
  };

  const maxBerita = limits.berita || Infinity;
  const maxTutorial = limits.tutorial || Infinity;
  const maxRiset = limits.riset || Infinity;

  for (const feed of feeds) {
    if (feed.category === "Berita" && result.berita.length < maxBerita) {
      result.berita.push(feed);
    } else if (
      feed.category === "Tutorial" &&
      result.tutorial.length < maxTutorial
    ) {
      result.tutorial.push(feed);
    } else if (feed.category === "Riset" && result.riset.length < maxRiset) {
      result.riset.push(feed);
    }

    // Early exit jika semua kategori sudah penuh
    if (
      result.berita.length >= maxBerita &&
      result.tutorial.length >= maxTutorial &&
      result.riset.length >= maxRiset
    ) {
      break;
    }
  }

  return result;
}

/**
 * Get feeds for "Semua" tab with balanced distribution
 */
export function getBalancedFeeds(
  feeds: Feed[],
  perCategory: number = 4
): Feed[] {
  const grouped = groupFeedsByCategory(feeds, {
    berita: perCategory,
    tutorial: perCategory,
    riset: perCategory,
  });

  // Interleave feeds dari semua kategori untuk variety
  const result: Feed[] = [];
  const maxLength = Math.max(
    grouped.berita.length,
    grouped.tutorial.length,
    grouped.riset.length
  );

  for (let i = 0; i < maxLength; i++) {
    if (grouped.berita[i]) result.push(grouped.berita[i]);
    if (grouped.tutorial[i]) result.push(grouped.tutorial[i]);
    if (grouped.riset[i]) result.push(grouped.riset[i]);
  }

  return result;
}
