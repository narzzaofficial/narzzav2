import type {
  CreateAgreeAppInput,
  CreateAgreeCompanyInput,
  CreateAgreeDocumentInput,
  CreateAgreeTopicInput,
  UpdateAgreeAppInput,
  UpdateAgreeCompanyInput,
  UpdateAgreeDocumentInput,
  UpdateAgreeTopicInput,
} from "@/types/api";

async function readJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = (await res.json().catch(() => ({ error: "Request failed" }))) as {
      error?: string;
      details?: unknown;
    };
    const firstIssue =
      Array.isArray(error.details) && error.details.length > 0
        ? (error.details[0] as { message?: string })?.message
        : undefined;
    throw new Error(firstIssue || error.error || "Request failed");
  }
  return res.json();
}

export async function fetchAgreeTopics() {
  const res = await fetch("/api/agree/topics");
  return readJson<{ items: Array<Record<string, unknown>> }>(res);
}

export async function fetchAgreeTopicById(id: string) {
  const res = await fetch(`/api/agree/topics/${id}`);
  return readJson<Record<string, unknown>>(res);
}

export async function createAgreeTopic(data: CreateAgreeTopicInput) {
  const res = await fetch("/api/agree/topics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return readJson<Record<string, unknown>>(res);
}

export async function updateAgreeTopic(id: string, data: UpdateAgreeTopicInput) {
  const res = await fetch(`/api/agree/topics/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return readJson<Record<string, unknown>>(res);
}

export async function deleteAgreeTopic(id: string) {
  const res = await fetch(`/api/agree/topics/${id}`, { method: "DELETE" });
  await readJson<{ success: boolean }>(res);
}

export async function fetchAgreeCompanies(topicId?: string) {
  const query = topicId ? `?topicId=${topicId}` : "";
  const res = await fetch(`/api/agree/companies${query}`);
  return readJson<{ items: Array<Record<string, unknown>> }>(res);
}

export async function fetchAgreeCompanyById(id: string) {
  const res = await fetch(`/api/agree/companies/${id}`);
  return readJson<Record<string, unknown>>(res);
}

export async function createAgreeCompany(data: CreateAgreeCompanyInput) {
  const res = await fetch("/api/agree/companies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return readJson<Record<string, unknown>>(res);
}

export async function updateAgreeCompany(id: string, data: UpdateAgreeCompanyInput) {
  const res = await fetch(`/api/agree/companies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return readJson<Record<string, unknown>>(res);
}

export async function deleteAgreeCompany(id: string) {
  const res = await fetch(`/api/agree/companies/${id}`, { method: "DELETE" });
  await readJson<{ success: boolean }>(res);
}

export async function fetchAgreeApps(companyId?: string) {
  const query = companyId ? `?companyId=${companyId}` : "";
  const res = await fetch(`/api/agree/apps${query}`);
  return readJson<{ items: Array<Record<string, unknown>> }>(res);
}

export async function fetchAgreeAppById(id: string) {
  const res = await fetch(`/api/agree/apps/${id}`);
  return readJson<Record<string, unknown>>(res);
}

export async function createAgreeApp(data: CreateAgreeAppInput) {
  const res = await fetch("/api/agree/apps", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return readJson<Record<string, unknown>>(res);
}

export async function updateAgreeApp(id: string, data: UpdateAgreeAppInput) {
  const res = await fetch(`/api/agree/apps/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return readJson<Record<string, unknown>>(res);
}

export async function deleteAgreeApp(id: string) {
  const res = await fetch(`/api/agree/apps/${id}`, { method: "DELETE" });
  await readJson<{ success: boolean }>(res);
}

export async function fetchAgreeDocuments(appId?: string) {
  const query = appId ? `?appId=${appId}` : "";
  const res = await fetch(`/api/agree/documents${query}`);
  return readJson<{ items: Array<Record<string, unknown>> }>(res);
}

export async function fetchAgreeDocumentById(id: string) {
  const res = await fetch(`/api/agree/documents/${id}`);
  return readJson<Record<string, unknown>>(res);
}

export async function createAgreeDocument(data: CreateAgreeDocumentInput) {
  const res = await fetch("/api/agree/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return readJson<Record<string, unknown>>(res);
}

export async function updateAgreeDocument(id: string, data: UpdateAgreeDocumentInput) {
  const res = await fetch(`/api/agree/documents/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return readJson<Record<string, unknown>>(res);
}

export async function deleteAgreeDocument(id: string) {
  const res = await fetch(`/api/agree/documents/${id}`, { method: "DELETE" });
  await readJson<{ success: boolean }>(res);
}
