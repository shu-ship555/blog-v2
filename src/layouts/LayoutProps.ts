// src/layouts/LayoutProps.ts
import type { Blog, Category, Tag } from "../libs/microcms.ts";

type ImageCategory = {
	id: string;
	slug: string;
	title: string;
	enTitle: string;
};

type ImageTag = {
	id: string;
	slug: string;
	title: string;
	enTitle: string;
};

export interface LayoutProps {
	title: string;
	description?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	pageUrl?: string;
	breadcrumb?: boolean;
	navigation?: [];
	header?: boolean;
	blog?: Blog;
	category?: Category;
	tag?: Tag;
	isIconsPage?: boolean;
	isImagesPage?: boolean;
	imageCategory?: ImageCategory;
	imageSize?: string;
	imageTag?: ImageTag;
	isWorksPage?: boolean;
}
