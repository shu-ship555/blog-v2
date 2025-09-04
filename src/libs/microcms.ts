// SDK利用準備
import type {
  MicroCMSQueries,
  MicroCMSListContent,
  MicroCMSObjectContent,
  MicroCMSImage,
} from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: import.meta.env.PUBLIC_MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.PUBLIC_MICROCMS_API_KEY,
});

export type MicroCMSResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

export type OGP = {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: MicroCMSImage;
};

export type Blog = {
  title: string;
  content: string;
  category: Category;
  publishedAt: string;
  description: string;
  tag: Tag[];
  eyecatch: {
    url: string;
    height: number;
    width: number;
  };
  readingTime: number;
  ogp: OGP | null;
} & MicroCMSListContent;

export type Category = {
  name: string;
  slug: string;
  count: number;
  labelColor: string;
} & MicroCMSListContent;

export type Tag = {
  name: string;
  slug: string;
} & MicroCMSListContent;

export type SiteSettings = {
  title: string;
  description: string;
  about: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
} & MicroCMSObjectContent;

export const getContents = <T>(endpoint: string, queries?: MicroCMSQueries) => {
  return client.getList<T>({ endpoint, queries });
}

export const getAllContents = async <T>(
  endpoint: string,
  queries: MicroCMSQueries = {}
): Promise<MicroCMSResponse<T>> => {
  const allContents: T[] = [];
  let offset = queries.offset || 0;
  const limit = 100;

  while (true) {
    const response = await client.get<MicroCMSResponse<T>>({
      endpoint,
      queries: {
        ...queries,
        offset,
        limit,
      },
    });

    allContents.push(...response.contents);

    if (allContents.length >= response.totalCount) {
      break;
    }

    offset += limit;
  }

  return { contents: allContents, totalCount: allContents.length, offset: 0, limit };
};

export const getBlogs = (queries?: MicroCMSQueries) =>
  client.getList<Blog>({ endpoint: "blogs", queries });

export const getBlogDetail = (
  contentId: string,
  queries: MicroCMSQueries = {}
) => {
  return client.getListDetail<Blog>({
    endpoint: "blogs",
    contentId,
    queries,
  });
};

export const getCategoryList = (queries?: MicroCMSQueries) =>
  getAllContents<Category>("categories", queries);

export const getTags = (queries?: MicroCMSQueries) =>
  getAllContents<Tag>("tags", queries);
