import type { ChatLine } from "@/types/content";

export type AgreeTopicSlug = string;
export type AgreeTopicIcon = string;

export type AgreeDocumentType =
  | "terms-of-service"
  | "privacy-policy"
  | "community-guidelines";

export interface AgreeTopic {
  name: string;
  slug: AgreeTopicSlug;
  description: string;
  eyebrow: string;
  icon: AgreeTopicIcon;
}

export interface AgreeCompany {
  id: string;
  name: string;
  slug: string;
  topic: AgreeTopicSlug;
  logo: string;
  description: string;
  createdAt: number;
}

export interface AgreeApp {
  id: string;
  name: string;
  slug: string;
  companyId: string;
  description: string;
  icon: string;
  createdAt: number;
}

export interface AgreeAnalysis {
  summary: string[];
  agreedWithoutRealizing: string[];
  surprisingPoints: string[];
  dataCollected: string[];
  platformRights: string[];
  risks: string[];
  tips: string[];
}

export interface AgreeDocument {
  id: string;
  title: string;
  slug: string;
  appId: string;
  type: AgreeDocumentType;
  updatedAt: number;
  dek: string;
  tosOriginal: string;
  tosTranslation?: string;
  analysis: AgreeAnalysis;
  content: ChatLine[];
}

export interface AgreeTopicSummary extends AgreeTopic {
  companyCount: number;
  appCount: number;
  documentCount: number;
}

export interface AgreeDocumentListItem extends AgreeDocument {
  topic: AgreeTopic;
  company: AgreeCompany;
  app: AgreeApp;
}

export interface AgreeLatestEntry {
  id: string;
  type: "company" | "app" | "document";
  title: string;
  description: string;
  href: string;
  createdAt: number;
  appSlug?: string;
  appIcon?: string;
}

export interface AgreeCompanyWithApps extends AgreeCompany {
  topicData: AgreeTopic;
  apps: AgreeApp[];
}

export interface AgreeAppWithDocuments extends AgreeApp {
  company: AgreeCompany;
  topicData: AgreeTopic;
  documents: AgreeDocument[];
}

export interface AgreeDocumentDetail extends AgreeDocument {
  topic: AgreeTopic;
  company: AgreeCompany;
  app: AgreeApp;
}
