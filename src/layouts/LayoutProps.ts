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
	isBlogsPage?: boolean;
	isContactPage?: boolean;
	isPortfolioPage?: boolean;
	isPortfolioIconPage?: boolean;
	isPortfolioProductPage?: boolean;
}
