// Notion REST API を直接 fetch で呼ぶ（SDK v5 の dataSources.query が
// 旧 databases.query と別エンドポイントを叩くため）
import fs from "node:fs/promises";
import path from "node:path";

const NOTION_VERSION = "2022-06-28";

const notionFetch = async (path: string, body?: object) => {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${import.meta.env.NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? res.statusText);
  }
  return res.json();
};

// --- 型定義 ---

interface RichTextItem {
  plain_text: string;
}

interface NotionPage {
  id: string;
  properties: Record<string, NotionProperty>;
}

type NotionFile =
  | { type: "file"; file: { url: string }; name?: string }
  | { type: "external"; external: { url: string }; name?: string };

type NotionProperty = {
  type: string;
  title?: RichTextItem[];
  rich_text?: RichTextItem[];
  url?: string | null;
  number?: number | null;
  select?: { name: string } | null;
  files?: NotionFile[];
  relation?: { id: string }[];
};

const richTextToString = (items: RichTextItem[]) =>
  items.map((t) => t.plain_text).join("");

const getTitle = (page: NotionPage, key: string): string => {
  const prop = page.properties[key];
  if (prop?.type === "title" && prop.title) return richTextToString(prop.title);
  return "";
};

const getRichText = (page: NotionPage, key: string): string => {
  const prop = page.properties[key];
  if (prop?.type === "rich_text" && prop.rich_text) return richTextToString(prop.rich_text);
  return "";
};

const getUrl = (page: NotionPage, key: string): string => {
  const prop = page.properties[key];
  if (prop?.type === "url") return prop.url ?? "";
  return "";
};

const getNumber = (page: NotionPage, key: string): number => {
  const prop = page.properties[key];
  if (prop?.type === "number") return prop.number ?? 0;
  return 0;
};

const getSelect = (page: NotionPage, key: string): string => {
  const prop = page.properties[key];
  if (prop?.type === "select") return prop.select?.name ?? "";
  return "";
};

const getRelationIds = (page: NotionPage, key: string): string[] => {
  const prop = page.properties[key];
  if (prop?.type !== "relation" || !prop.relation) return [];
  return prop.relation.map((r) => r.id);
};

// Notion files プロパティの先頭エントリの URL を取得
const getFileUrl = (page: NotionPage, key: string): string => {
  const prop = page.properties[key];
  if (prop?.type !== "files" || !prop.files?.length) return "";
  const f = prop.files[0];
  return f.type === "file" ? f.file.url : f.external.url;
};

// Notion 上にホストされた画像 URL は ~1時間で失効するため、
// ビルド時にダウンロードして public/ に保存し、ローカル URL を返す
const MIME_EXT: Record<string, string> = {
  "image/svg+xml": "svg",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const downloadAndCacheImage = async (
  url: string,
  basename: string,
): Promise<string> => {
  if (!url) return "";
  // 外部URLでNotion S3以外（CDNなど）はそのまま使える
  if (!url.includes("amazonaws.com") && !url.includes("notion.so")) {
    return url;
  }
  try {
    const res = await fetch(url);
    if (!res.ok) return url;
    const contentType = (res.headers.get("content-type") ?? "image/png").split(";")[0].trim().toLowerCase();
    const ext = MIME_EXT[contentType] ?? "png";
    const filename = `${basename}.${ext}`;
    const publicDir = path.join(process.cwd(), "public", "notion");
    await fs.mkdir(publicDir, { recursive: true });
    const buffer = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(path.join(publicDir, filename), buffer);
    return `/notion/${filename}`;
  } catch (e) {
    console.warn(`[notion] downloadAndCacheImage failed:`, (e as Error).message);
    return url;
  }
};

// --- 公開型 ---

export interface Profile {
  nameEn: string;
  nameJp: string;
  tagline: string;
  bio: string;
  careerSummary: string;
  avatarUrl: string;
}

export interface WorkHistory {
  id: string;
  company: string;
  periodStart: string;
  periodEnd: string;
  role: string;
  description: string;
  order: number;
  subItems: WorkHistory[];
}

export interface SelfPR {
  title: string;
  description: string;
  order: number;
}

export interface CareerPlan {
  title: string;
  description: string;
  order: number;
}

export interface Account {
  platform: string;
  url: string;
  order: number;
}

export interface Skill {
  name: string;
  category: string; // "言語" | "フレームワーク" | "ツール"
  order: number;
}

// --- API 関数 ---

const queryDB = async (dbId: string, sort = true): Promise<NotionPage[]> => {
  try {
    const data = await notionFetch(`/databases/${dbId}/query`, {
      ...(sort && { sorts: [{ property: "order", direction: "ascending" }] }),
    });
    return (data.results ?? []) as NotionPage[];
  } catch (e) {
    console.warn(`[notion] queryDB failed for ${dbId}:`, (e as Error).message);
    return [];
  }
};

export const getProfile = async (): Promise<Profile> => {
  // プロフィールは1件固定のため sort なしで取得
  const pages = await queryDB(import.meta.env.NOTION_PROFILE_PAGE_ID, false);
  if (pages.length === 0) {
    return { nameEn: "", nameJp: "", tagline: "", bio: "", careerSummary: "", avatarUrl: "" };
  }
  const page = pages[0];
  const remoteAvatarUrl = getFileUrl(page, "avatar");
  const avatarUrl = await downloadAndCacheImage(remoteAvatarUrl, "avatar");
  return {
    nameEn: getTitle(page, "name_en"),
    nameJp: getRichText(page, "name_jp"),
    tagline: getRichText(page, "tagline"),
    bio: getRichText(page, "bio"),
    careerSummary: getRichText(page, "career_summary"),
    avatarUrl,
  };
};

export const getWorkHistory = async (): Promise<WorkHistory[]> => {
  const pages = await queryDB(import.meta.env.NOTION_WORK_HISTORY_DB_ID);

  // 全レコードをフラットに変換
  const items: (WorkHistory & { parentId: string | null })[] = pages.map((page) => ({
    id: page.id,
    company: getTitle(page, "company"),
    periodStart: getRichText(page, "period_start"),
    periodEnd: getRichText(page, "period_end"),
    role: getRichText(page, "role"),
    description: getRichText(page, "description"),
    order: getNumber(page, "order"),
    subItems: [],
    parentId: getRelationIds(page, "親アイテム")[0] ?? null,
  }));

  // id → item の Map を作って親子をリンク
  const itemMap = new Map(items.map((it) => [it.id, it]));
  const topLevel: WorkHistory[] = [];
  for (const item of items) {
    if (item.parentId && itemMap.has(item.parentId)) {
      itemMap.get(item.parentId)!.subItems.push(item);
    } else {
      topLevel.push(item);
    }
  }

  // parentId は内部用なので公開型からは除外（実体は残るが TypeScript 上は WorkHistory として返す）
  return topLevel;
};

export const getSelfPR = async (): Promise<SelfPR[]> => {
  const pages = await queryDB(import.meta.env.NOTION_SELF_PR_DB_ID);
  return pages.map((page) => ({
    title: getTitle(page, "title"),
    description: getRichText(page, "description"),
    order: getNumber(page, "order"),
  }));
};

export const getCareerPlan = async (): Promise<CareerPlan[]> => {
  const pages = await queryDB(import.meta.env.NOTION_CAREER_PLAN_DB_ID);
  return pages.map((page) => ({
    title: getTitle(page, "title"),
    description: getRichText(page, "description"),
    order: getNumber(page, "order"),
  }));
};

export const getAccounts = async (): Promise<Account[]> => {
  const pages = await queryDB(import.meta.env.NOTION_ACCOUNTS_DB_ID);
  return pages.map((page) => ({
    platform: getTitle(page, "platform"),
    url: getUrl(page, "url"),
    order: getNumber(page, "order"),
  }));
};

export const getSkills = async (): Promise<Skill[]> => {
  const pages = await queryDB(import.meta.env.NOTION_SKILLS_DB_ID);
  return pages.map((page) => ({
    name: getTitle(page, "name"),
    category: getSelect(page, "category"),
    order: getNumber(page, "order"),
  }));
};
