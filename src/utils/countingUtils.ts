// src/utils/countingUtils.ts
// カテゴリ・タグのカウント処理ユーティリティ

import type { Blog, Category, Tag } from "../types";

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
