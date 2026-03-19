// types/api.ts

import type { ChatLine, Category, HukumCategory, LawDoc } from "./content";
import type { AgreeAnalysis, AgreeDocumentType } from "./agree";

export interface CreateFeedInput {
  title: string;
  category: Category;
  image: string;
  lines: ChatLine[];
  takeaway: string;
  author?: string;
  source?: { title: string; url: string };
  storyId?: number | null;
}

export interface UpdateFeedInput {
  title?: string;
  category?: Category;
  image?: string;
  lines?: ChatLine[];
  takeaway?: string;
  author?: string;
  source?: { title: string; url: string };
  storyId?: number | null;
}

export interface CreateLawInput {
  title: string;
  category: HukumCategory;
  summary: string;
  originalText: string;
  explanationLines: LawDoc["explanationLines"];
  number: string;
  year: number;
  enactedAt: number;
  promulgatedAt: number;
  effectiveAt?: number;
  status: LawDoc["status"];
  source: LawDoc["source"];
  storyId?: number | null;
}

export type UpdateLawInput = Partial<CreateLawInput>;

export interface CreateStoryInput {
  name: string;
  label: string;
  type: string;
  image: string;
  palette?: string;
  viral?: boolean;
}

export type UpdateStoryInput = Partial<CreateStoryInput>;

export interface CreateAgreeTopicInput {
  name: string;
  slug?: string;
  description: string;
  eyebrow?: string;
  icon?: string;
  isActive?: boolean;
}

export type UpdateAgreeTopicInput = Partial<CreateAgreeTopicInput>;

export interface CreateAgreeCompanyInput {
  name: string;
  slug?: string;
  topicId: string;
  logo: string;
  description: string;
  isActive?: boolean;
}

export type UpdateAgreeCompanyInput = Partial<CreateAgreeCompanyInput>;

export interface CreateAgreeAppInput {
  name: string;
  slug?: string;
  companyId: string;
  description: string;
  icon: string;
  isPopular?: boolean;
  popularScore?: number;
  isActive?: boolean;
}

export type UpdateAgreeAppInput = Partial<CreateAgreeAppInput>;

export interface CreateAgreeDocumentInput {
  title: string;
  slug?: string;
  appId: string;
  type: AgreeDocumentType;
  dek: string;
  tosOriginal: string;
  tosTranslation?: string;
  analysis: AgreeAnalysis;
  content: ChatLine[];
  isActive?: boolean;
}

export type UpdateAgreeDocumentInput = Partial<CreateAgreeDocumentInput>;
