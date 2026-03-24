import { revalidatePath, revalidateTag } from "next/cache";
import mongoose from "mongoose";

import type {
  AgreeAnalysis,
  AgreeApp,
  AgreeCompany,
  AgreeDocument,
  AgreeTopic,
} from "@/types/agree";

export const AGREE_TAGS = {
  root: "after-click-agree",
  topics: "agree-topics",
  companies: "agree-companies",
  apps: "agree-apps",
  documents: "agree-documents",
} as const;

type TopicLike = {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  eyebrow?: string;
  icon?: string;
};

type CompanyLike = {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  topicId: mongoose.Types.ObjectId;
  logo?: string;
  description?: string;
  createdAt?: number;
};

type AppLike = {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  companyId: mongoose.Types.ObjectId;
  description?: string;
  icon?: string;
  createdAt?: number;
};

type DocumentLike = {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  appId: mongoose.Types.ObjectId;
  type: AgreeDocument["type"];
  updatedAt?: number;
  dek?: string;
  tosOriginal?: string;
  tosTranslation?: string;
  analysis?: Partial<AgreeAnalysis>;
  content?: Array<{ role: "q" | "a"; text: string }>;
};

export function toAgreeTopic(doc: TopicLike): AgreeTopic {
  return {
    name: doc.name,
    slug: doc.slug,
    description: doc.description ?? "",
    eyebrow: doc.eyebrow ?? "Setelah Klik Agree",
    icon: doc.icon ?? "cpu",
  };
}

export function toAgreeCompany(doc: CompanyLike, topicSlug: string): AgreeCompany {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    topic: topicSlug,
    logo: doc.logo ?? "",
    description: doc.description ?? "",
    createdAt: doc.createdAt ?? Date.now(),
  };
}

export function toAgreeApp(doc: AppLike): AgreeApp {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    companyId: String(doc.companyId),
    description: doc.description ?? "",
    icon: doc.icon ?? "",
    createdAt: doc.createdAt ?? Date.now(),
  };
}

function normalizeAnalysis(analysis?: Partial<AgreeAnalysis>): AgreeAnalysis {
  return {
    summary: analysis?.summary ?? [],
    agreedWithoutRealizing: analysis?.agreedWithoutRealizing ?? [],
    surprisingPoints: analysis?.surprisingPoints ?? [],
    dataCollected: analysis?.dataCollected ?? [],
    platformRights: analysis?.platformRights ?? [],
    risks: analysis?.risks ?? [],
    tips: analysis?.tips ?? [],
  };
}

export function toAgreeDocument(doc: DocumentLike): AgreeDocument {
  return {
    id: String(doc._id),
    title: doc.title,
    slug: doc.slug,
    appId: String(doc.appId),
    type: doc.type,
    updatedAt: doc.updatedAt ?? Date.now(),
    dek: doc.dek ?? "",
    tosOriginal: doc.tosOriginal ?? "",
    tosTranslation: doc.tosTranslation?.trim() ? doc.tosTranslation : undefined,
    analysis: normalizeAnalysis(doc.analysis),
    content: (doc.content ?? []).map((line) => ({
      role: line.role,
      text: line.text,
    })),
  };
}

export function revalidateAgreeCaches() {
  revalidateTag(AGREE_TAGS.root, "max");
  revalidateTag(AGREE_TAGS.topics, "max");
  revalidateTag(AGREE_TAGS.companies, "max");
  revalidateTag(AGREE_TAGS.apps, "max");
  revalidateTag(AGREE_TAGS.documents, "max");
  revalidatePath("/setelah-klik-agree");
}
