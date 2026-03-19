import "server-only";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import mongoose from "mongoose";

import { AGREE_TAGS, toAgreeApp, toAgreeCompany, toAgreeDocument, toAgreeTopic } from "@/lib/api/agree-helpers";
import { connectDB } from "@/lib/mongodb";
import { AgreeAppModel } from "@/lib/models/AgreeApp";
import { AgreeCompanyModel } from "@/lib/models/AgreeCompany";
import { AgreeDocumentModel } from "@/lib/models/AgreeDocument";
import { AgreeTopicModel } from "@/lib/models/AgreeTopic";
import type {
  AgreeApp,
  AgreeAppWithDocuments,
  AgreeCompanyWithApps,
  AgreeDocument,
  AgreeDocumentDetail,
  AgreeDocumentListItem,
  AgreeLatestEntry,
  AgreeTopic,
  AgreeTopicSummary,
} from "@/types/agree";

function asObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
}

type JoinedData = {
  topics: IAgreeTopicLean[];
  companies: IAgreeCompanyLean[];
  apps: IAgreeAppLean[];
  documents: IAgreeDocumentLean[];
};

type IAgreeTopicLean = {
  _id: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  description?: string;
  eyebrow?: string;
  icon?: string;
};

type IAgreeCompanyLean = {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  topicId: mongoose.Types.ObjectId;
  logo?: string;
  description?: string;
  createdAt: number;
};

type IAgreeAppLean = {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  companyId: mongoose.Types.ObjectId;
  description?: string;
  icon?: string;
  createdAt: number;
  isPopular?: boolean;
  popularScore?: number;
};

type IAgreeDocumentLean = {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  appId: mongoose.Types.ObjectId;
  type: AgreeDocument["type"];
  dek?: string;
  tosOriginal?: string;
  tosTranslation?: string;
  analysis?: AgreeDocument["analysis"];
  content?: AgreeDocument["content"];
  updatedAt: number;
};

async function fetchJoinedData(): Promise<JoinedData> {
  const conn = await connectDB();
  if (!conn) return { topics: [], companies: [], apps: [], documents: [] };

  const [topics, companies, apps, documents] = await Promise.all([
    AgreeTopicModel.find({ isActive: true }).sort({ name: 1 }).lean<IAgreeTopicLean[]>(),
    AgreeCompanyModel.find({ isActive: true }).sort({ createdAt: -1 }).lean<IAgreeCompanyLean[]>(),
    AgreeAppModel.find({ isActive: true })
      .sort({ isPopular: -1, popularScore: -1, createdAt: -1 })
      .lean<IAgreeAppLean[]>(),
    AgreeDocumentModel.find({ isActive: true }).sort({ updatedAt: -1 }).lean<IAgreeDocumentLean[]>(),
  ]);

  return { topics, companies, apps, documents };
}

const getAgreeLandingDataCached = unstable_cache(
  async () => {
    const { topics, companies, apps, documents } = await fetchJoinedData();

    const topicById = new Map(topics.map((topic) => [String(topic._id), topic]));
    const companyById = new Map(companies.map((company) => [String(company._id), company]));
    const appById = new Map(apps.map((app) => [String(app._id), app]));

    const topicSummaries: AgreeTopicSummary[] = topics.map((topicDoc) => {
      const topicId = String(topicDoc._id);
      const topicCompanies = companies.filter((company) => String(company.topicId) === topicId);
      const companyIds = new Set(topicCompanies.map((company) => String(company._id)));
      const topicApps = apps.filter((app) => companyIds.has(String(app.companyId)));
      const appIds = new Set(topicApps.map((app) => String(app._id)));
      const topicDocuments = documents.filter((document) => appIds.has(String(document.appId)));

      return {
        ...toAgreeTopic(topicDoc),
        companyCount: topicCompanies.length,
        appCount: topicApps.length,
        documentCount: topicDocuments.length,
      };
    });

    const latestDocuments: AgreeDocumentListItem[] = documents
      .map((documentDoc) => {
        const appDoc = appById.get(String(documentDoc.appId));
        if (!appDoc) return null;
        const companyDoc = companyById.get(String(appDoc.companyId));
        if (!companyDoc) return null;
        const topicDoc = topicById.get(String(companyDoc.topicId));
        if (!topicDoc) return null;

        return {
          ...toAgreeDocument(documentDoc),
          app: toAgreeApp(appDoc),
          company: toAgreeCompany(companyDoc, topicDoc.slug),
          topic: toAgreeTopic(topicDoc),
        };
      })
      .filter((item): item is AgreeDocumentListItem => Boolean(item));

    const latestEntries: AgreeLatestEntry[] = [
      ...companies.map((companyDoc): AgreeLatestEntry | null => {
        const topicDoc = topicById.get(String(companyDoc.topicId));
        if (!topicDoc) return null;
        return {
          id: String(companyDoc._id),
          type: "company" as const,
          title: companyDoc.name,
          description: `Company baru di topik ${topicDoc.slug}.`,
          href: `/setelah-klik-agree/${topicDoc.slug}/${companyDoc.slug}`,
          createdAt: companyDoc.createdAt,
        };
      }),
      ...apps.map((appDoc): AgreeLatestEntry | null => {
        const companyDoc = companyById.get(String(appDoc.companyId));
        if (!companyDoc) return null;
        const topicDoc = topicById.get(String(companyDoc.topicId));
        if (!topicDoc) return null;
        return {
          id: String(appDoc._id),
          type: "app" as const,
          title: appDoc.name,
          description: `App baru dari ${companyDoc.name}.`,
          href: `/setelah-klik-agree/${topicDoc.slug}/${companyDoc.slug}/${appDoc.slug}`,
          createdAt: appDoc.createdAt,
          appSlug: appDoc.slug,
          appIcon: appDoc.icon ?? "",
        };
      }),
      ...latestDocuments.map((document) => ({
        id: document.id,
        type: "document" as const,
        title: `${document.app.name} ${document.title}`,
        description: `Dokumen ${document.type.replaceAll("-", " ")} baru dibedah.`,
        href: `/setelah-klik-agree/${document.topic.slug}/${document.company.slug}/${document.app.slug}/${document.slug}`,
        createdAt: document.updatedAt,
      })),
    ]
      .filter((entry): entry is AgreeLatestEntry => Boolean(entry))
      .sort((left, right) => right.createdAt - left.createdAt)
      .slice(0, 8);

    const popularApps = apps
      .filter((app) => app.isPopular)
      .slice(0, 16)
      .map((appDoc) => {
        const companyDoc = companyById.get(String(appDoc.companyId));
        if (!companyDoc) return null;
        const topicDoc = topicById.get(String(companyDoc.topicId));
        if (!topicDoc) return null;
        return {
          app: toAgreeApp(appDoc),
          company: toAgreeCompany(companyDoc, topicDoc.slug),
          topic: toAgreeTopic(topicDoc),
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    return {
      topics: topicSummaries,
      popularApps,
      latestEntries,
    };
  },
  ["agree-landing"],
  { revalidate: 3600, tags: [AGREE_TAGS.root, AGREE_TAGS.topics, AGREE_TAGS.apps] }
);

const getAgreeTopicPageDataCached = unstable_cache(
  async (topicSlug: string) => {
    const { topics, companies, apps, documents } = await fetchJoinedData();
    const topicDoc = topics.find((topic) => topic.slug === topicSlug) ?? null;
    if (!topicDoc) return null;

    const topicId = String(topicDoc._id);
    const topicCompaniesDocs = companies.filter((company) => String(company.topicId) === topicId);
    const companyIds = new Set(topicCompaniesDocs.map((company) => String(company._id)));
    const topicAppsDocs = apps.filter((app) => companyIds.has(String(app.companyId)));
    const appIds = new Set(topicAppsDocs.map((app) => String(app._id)));
    const topicDocumentsDocs = documents.filter((document) => appIds.has(String(document.appId)));

    const topic: AgreeTopic = toAgreeTopic(topicDoc);
    const topicCompanies = topicCompaniesDocs.map((company) =>
      toAgreeCompany(company, topic.slug)
    );
    const topicApps: AgreeApp[] = topicAppsDocs.map((app) => toAgreeApp(app));

    const latestDocuments: AgreeDocumentListItem[] = topicDocumentsDocs
      .map((documentDoc) => {
        const app = topicApps.find((item) => item.id === String(documentDoc.appId));
        if (!app) return null;
        const company = topicCompanies.find((item) => item.id === app.companyId);
        if (!company) return null;
        return { ...toAgreeDocument(documentDoc), app, company, topic };
      })
      .filter((item): item is AgreeDocumentListItem => Boolean(item));

    return {
      topic,
      companies: topicCompanies,
      apps: topicApps,
      latestDocuments,
    };
  },
  ["agree-topic-page"],
  { revalidate: 3600, tags: [AGREE_TAGS.root, AGREE_TAGS.topics, AGREE_TAGS.companies, AGREE_TAGS.apps] }
);

const getAgreeCompanyPageDataCached = unstable_cache(
  async (topicSlug: string, companySlug: string): Promise<AgreeCompanyWithApps | null> => {
    const { topics, companies, apps } = await fetchJoinedData();

    const topicDoc = topics.find((topic) => topic.slug === topicSlug) ?? null;
    if (!topicDoc) return null;

    const companyDoc =
      companies.find(
        (company) =>
          String(company.topicId) === String(topicDoc._id) && company.slug === companySlug
      ) ?? null;
    if (!companyDoc) return null;

    const topicData = toAgreeTopic(topicDoc);
    return {
      ...toAgreeCompany(companyDoc, topicData.slug),
      topicData,
      apps: apps
        .filter((app) => String(app.companyId) === String(companyDoc._id))
        .map(toAgreeApp),
    };
  },
  ["agree-company-page"],
  { revalidate: 3600, tags: [AGREE_TAGS.root, AGREE_TAGS.companies, AGREE_TAGS.apps] }
);

const getAgreeAppPageDataCached = unstable_cache(
  async (
    topicSlug: string,
    companySlug: string,
    appSlug: string
  ): Promise<AgreeAppWithDocuments | null> => {
    const companyData = await getAgreeCompanyPageDataCached(topicSlug, companySlug);
    if (!companyData) return null;

    const appId = companyData.apps.find((app) => app.slug === appSlug)?.id;
    if (!appId) return null;

    const conn = await connectDB();
    if (!conn) return null;

    const appObjectId = asObjectId(appId);
    if (!appObjectId) return null;

    const appDoc = await AgreeAppModel.findOne({ _id: appObjectId, isActive: true }).lean<IAgreeAppLean | null>();
    if (!appDoc) return null;

    const documents = await AgreeDocumentModel.find({ appId: appObjectId, isActive: true })
      .sort({ updatedAt: -1 })
      .lean<IAgreeDocumentLean[]>();

    return {
      ...toAgreeApp(appDoc),
      company: {
        id: companyData.id,
        name: companyData.name,
        slug: companyData.slug,
        topic: companyData.topic,
        logo: companyData.logo,
        description: companyData.description,
        createdAt: companyData.createdAt,
      },
      topicData: companyData.topicData,
      documents: documents.map((document) => toAgreeDocument(document)),
    };
  },
  ["agree-app-page"],
  { revalidate: 3600, tags: [AGREE_TAGS.root, AGREE_TAGS.apps, AGREE_TAGS.documents] }
);

const getAgreeDocumentDetailCached = unstable_cache(
  async (
    topicSlug: string,
    companySlug: string,
    appSlug: string,
    documentSlug: string
  ): Promise<AgreeDocumentDetail | null> => {
    const appData = await getAgreeAppPageDataCached(topicSlug, companySlug, appSlug);
    if (!appData) return null;

    const document = appData.documents.find((item) => item.slug === documentSlug) ?? null;
    if (!document) return null;

    return {
      ...document,
      topic: appData.topicData,
      company: appData.company,
      app: {
        id: appData.id,
        name: appData.name,
        slug: appData.slug,
        companyId: appData.companyId,
        description: appData.description,
        icon: appData.icon,
        createdAt: appData.createdAt,
      },
    };
  },
  ["agree-document-detail"],
  { revalidate: 3600, tags: [AGREE_TAGS.root, AGREE_TAGS.documents] }
);

const getAllAgreeDocumentPathsCached = unstable_cache(
  async () => {
    const { topics, companies, apps, documents } = await fetchJoinedData();
    const topicById = new Map(topics.map((topic) => [String(topic._id), topic]));
    const companyById = new Map(companies.map((company) => [String(company._id), company]));
    const appById = new Map(apps.map((app) => [String(app._id), app]));

    return documents
      .map((document) => {
        const app = appById.get(String(document.appId));
        if (!app) return null;
        const company = companyById.get(String(app.companyId));
        if (!company) return null;
        const topic = topicById.get(String(company.topicId));
        if (!topic) return null;

        return {
          topic: topic.slug,
          company: company.slug,
          app: app.slug,
          document: document.slug,
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  },
  ["agree-document-paths"],
  { revalidate: 3600, tags: [AGREE_TAGS.root, AGREE_TAGS.documents] }
);

export const getAgreeLandingData = cache(getAgreeLandingDataCached);
export const getAgreeTopicPageData = cache(getAgreeTopicPageDataCached);
export const getAgreeCompanyPageData = cache(getAgreeCompanyPageDataCached);
export const getAgreeAppPageData = cache(getAgreeAppPageDataCached);
export const getAgreeDocumentDetail = cache(getAgreeDocumentDetailCached);
export const getAllAgreeDocumentPaths = cache(getAllAgreeDocumentPathsCached);
export const getAgreeTopics = cache(async () => getAgreeLandingDataCached().then((data) => data.topics));
