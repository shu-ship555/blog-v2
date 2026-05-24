// src/layouts/LayoutProps.ts

export type BreadcrumbItem = {
	label: string;
	href?: string;
	clamp?: boolean; // 長いテキスト（記事タイトルなど）を1行で切り詰める
};

export interface LayoutProps {
	title: string;
	description?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogImage?: string;
	pageUrl?: string;
	breadcrumb?: BreadcrumbItem[];
	header?: boolean;
}
