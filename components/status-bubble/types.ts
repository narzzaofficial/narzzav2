"use client";

export type StatusStory = {
  id: number;
  name: string;
  label: string;
  type: string;
  palette?: string;
  image?: string;
  viral?: boolean;
};

export type StatusFeedItem = {
  id: number;
  slug: string;
  title: string;
  image: string;
  takeaway: string;
  category: string;
  storyId: number | null;
  href: string;
  ctaLabel: string;
  sourceType: "feed" | "law";
};
