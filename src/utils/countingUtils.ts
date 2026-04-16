// src/utils/countingUtils.ts
// カテゴリ・タグのカウント処理ユーティリティ

import type { Blog, Category, Tag } from "../types";
import { getAllContents } from "../libs/microcms";

/**
 * カテゴリごとのブログ記事数をカウントして返す
 */
export const getCountedCategories = (
	categories: Category[],
	blogs: Blog[]
): (Category & { count: number })[] => {
	return categories.map((category) => ({
		...category,
		count: blogs.filter((blog) => blog.category.id === category.id).length,
	}));
};

/**
 * タグごとのブログ記事数をカウントして返す
 */
export const getCountedTags = (
	tags: Tag[],
	blogs: Blog[]
): (Tag & { count: number })[] => {
	return tags.map((tag) => ({
		...tag,
		count: blogs.filter((blog) =>
			blog.tag.some((blogTag) => blogTag.id === tag.id)
		).length,
	}));
};

/**
 * Blogs / Categories / Tags を並列取得し、サイドバー用のカウント付きリストを返す
 */
export const getCategoryAndTagCounts = async () => {
	const [allBlogsResponse, allCategoriesResponse, allTagsResponse] = await Promise.all([
		getAllContents<Blog>("blogs"),
		getAllContents<Category>("categories"),
		getAllContents<Tag>("tags"),
	]);

	const allBlogs = allBlogsResponse.contents;
	const categoryCounts = getCountedCategories(allCategoriesResponse.contents, allBlogs);
	const tagCounts = getCountedTags(allTagsResponse.contents, allBlogs);

	return { categoryCounts, tagCounts, allBlogs, totalCount: allBlogsResponse.totalCount };
};
