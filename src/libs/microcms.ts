// SDK利用準備
import type { MicroCMSQueries, MicroCMSListContent } from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: import.meta.env.PUBLIC_MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.PUBLIC_MICROCMS_API_KEY,
});

// 型定義
export type Blog = {
  title: string;
  content: string;
} & MicroCMSListContent;

// APIの呼び出し
export const getBlogs = async (queries?: MicroCMSQueries) => {
  return await client.getList<Blog>({ endpoint: "blogs", queries });
};

export const getBlogDetail = async (
  contentId: string,
  queries?: MicroCMSQueries
) => {
  return await client.getListDetail<Blog>({
    endpoint: "blogs",
    contentId,
    queries,
  });
};