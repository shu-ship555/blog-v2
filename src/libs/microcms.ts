// SDK利用準備
import type { MicroCMSQueries } from "microcms-js-sdk";
import { createClient } from "microcms-js-sdk";

// 型定義は types/index.ts から再エクスポート
export type {
	MicroCMSResponse,
	OGP,
	Blog,
	Category,
	Tag,
	SiteSettings,
	Image,
	ImageCategory,
	ImageTag,
	ImageItem,
	Icon,
} from "../types";

import type { MicroCMSResponse, Blog, Category, Tag } from "../types";

const client = createClient({
	serviceDomain: import.meta.env.PUBLIC_MICROCMS_SERVICE_DOMAIN,
	apiKey: import.meta.env.PUBLIC_MICROCMS_API_KEY,
});

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
