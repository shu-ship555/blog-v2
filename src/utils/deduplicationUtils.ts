// src/utils/deduplicationUtils.ts
// 重複除去ユーティリティ

import type { Image, ImageCategory, ImageTag } from "../types";

/**
 * 配列から重複を除去する汎用関数
 * JSON.stringify/parseを使用してオブジェクトの重複を判定
 */
export const getUniqueItems = <T>(
	items: T[],
	keyFn: (item: T) => Record<string, unknown>
): T[] => {
	const seen = new Set<string>();
	return items.filter((item) => {
		const key = JSON.stringify(keyFn(item));
		if (seen.has(key)) {
			return false;
		}
		seen.add(key);
		return true;
	}).map((item) => keyFn(item) as unknown as T);
};

/**
 * 画像リストからユニークなカテゴリを抽出
 */
export const getUniqueCategories = (
	images: Image[]
): Omit<ImageCategory, "id">[] => {
	const seen = new Set<string>();
	const result: Omit<ImageCategory, "id">[] = [];

	for (const image of images) {
		const key = image.category.slug;
		if (!seen.has(key)) {
			seen.add(key);
			result.push({
				slug: image.category.slug,
				title: image.category.title,
				enTitle: image.category.enTitle,
			});
		}
	}

	return result;
};

/**
 * 画像リストからユニークなタグを抽出
 */
export const getUniqueTags = (
	images: Image[]
): Omit<ImageTag, "id">[] => {
	const seen = new Set<string>();
	const result: Omit<ImageTag, "id">[] = [];

	for (const image of images) {
		for (const tag of image.tag) {
			if (!seen.has(tag.slug)) {
				seen.add(tag.slug);
				result.push({
					slug: tag.slug,
					title: tag.title,
					enTitle: tag.enTitle,
				});
			}
		}
	}

	return result;
};

/**
 * 画像リストからユニークなサイズを抽出
 */
export const getUniqueSizes = (images: Image[]): string[] => {
	return [...new Set(images.map((image) => `${image.sizeHorizontal}×${image.sizeVertical}`))];
};
