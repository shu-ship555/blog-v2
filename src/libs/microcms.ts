// SDK利用準備
import type {
  MicroCMSQueries,
  MicroCMSListContent,
  MicroCMSObjectContent,
} from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: import.meta.env.PUBLIC_MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.PUBLIC_MICROCMS_API_KEY,
});

// 型定義
export type Blog = {
  title: string;
  content: string;
	category: Category;
} & MicroCMSListContent;

export type Category = {
  name: string;
} & MicroCMSListContent;

// Settingsの型定義をMicroCMSObjectContentを継承するように変更
export type SiteSettings = {
  title: string;
  description: string;
  about: string;
	id: string;
	createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
} & MicroCMSObjectContent; // オブジェクト形式のコンテンツ用

// APIの呼び出し
export const getBlogs = async (queries?: MicroCMSQueries) => {
  return client.getList<Blog>({ endpoint: "blogs", queries });
};

export const getBlogDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  return client.getListDetail<Blog>({
    endpoint: "blogs",
    contentId,
    queries,
  });
};

export const getCategoryList = async (queries?: MicroCMSQueries) => {
  return client.getList<Category>({ endpoint: "categories", queries });
};

// 設定取得のデフォルト値
const DEFAULT_SETTINGS: SiteSettings = {
  title: "あなたのサイトタイトルを設定してください",
  description: "あなたのサイトの説明を設定してください",
  about: "ここにサイトについての文章を設定してください",
  id: "default-settings", // ダミーのIDを追加
  createdAt: "2023-01-01T00:00:00.000Z", // ダミーの日付を追加
  updatedAt: "2023-01-01T00:00:00.000Z", // ダミーの日付を追加
  publishedAt: "2023-01-01T00:00:00.000Z", // ダミーの日付を追加
  revisedAt: "2023-01-01T00:00:00.000Z", // ダミーの日付を追加
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    // getListDetailではなくgetObjectを使用 (単一コンテンツの場合)
    const data = await client.getObject<SiteSettings>({ endpoint: "settings" });
    return data;
  } catch (error: any) {
    console.error("設定の取得に失敗しました。デフォルト設定を使用します。", error);
    return DEFAULT_SETTINGS;
  }
};
