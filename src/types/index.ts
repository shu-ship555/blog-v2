// src/types/index.ts
// 共通の型定義ファイル

import type {
	MicroCMSListContent,
	MicroCMSObjectContent,
	MicroCMSImage,
} from "microcms-js-sdk";

// ============================================
// microCMS共通型
// ============================================

export type MicroCMSResponse<T> = {
	contents: T[];
	totalCount: number;
	offset: number;
	limit: number;
};

// ============================================
// Blog関連の型
// ============================================

export type OGP = {
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: MicroCMSImage;
};

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

// ============================================
// Works関連の型（Image / Icon）
// ============================================

export type ImageCategory = {
	id: string;
	slug: string;
	title: string;
	enTitle: string;
};

export type ImageTag = {
	id: string;
	slug: string;
	title: string;
	enTitle: string;
};

export type ImageItem = {
	url: string;
	width?: number;
	height?: number;
};

export type Image = {
	id: string;
	title: string;
	images: ImageItem[];
	sizeHorizontal: number;
	sizeVertical: number;
	isPrivate: boolean;
	category: ImageCategory;
	tag: ImageTag[];
};

export type Icon = {
	id: string;
	title: string;
	enTitle: string;
	image: {
		url: string;
		width: number;
		height: number;
	};
};

// ============================================
// カウント付きの派生型（サイドバー等で使用）
// ============================================

export type CategoryWithCount = Category & { count: number };
export type TagWithCount = Tag & { count: number };
