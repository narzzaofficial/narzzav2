import { revalidatePath, revalidateTag } from "next/cache";

import type { IStory } from "@/lib/models/Story";
import type { Story } from "@/types/content";

export function storyToJson(doc: IStory): Story {
  return {
    id: doc.id,
    name: doc.name,
    label: doc.label,
    type: doc.type,
    image: doc.image ?? "",
    palette: doc.palette ?? "",
    viral: doc.viral ?? false,
    createdAt: doc.createdAt ?? Date.now(),
  };
}

export function revalidateAllStoryCaches() {
  revalidateTag("stories", "max");
  revalidatePath("/", "layout");
}

export function revalidateStoryCaches() {
  revalidateAllStoryCaches();
}
