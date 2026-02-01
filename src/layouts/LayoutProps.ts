// src/layouts/LayoutProps.ts
import type { Blog, Category, Tag, ImageCategory, ImageTag } from "../types";

export interface LayoutProps {
	title: string;
	description?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	pageUrl?: string;
	breadcrumb?: boolean;
	navigation?: boolean;
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
