export const WORK_FILTERS = {
	WEBSITE: "type[contains]ウェブサイト",
	PRODUCT: "type[contains]プロダクト",
	GRAPHIC: "type[contains]グラフィック",
	ILLUSTRATION: "type[contains]イラスト",
	ICON: "type[contains]アイコン",
} as const;

export const PAGE_SIZES = {
	BLOGS: 10,
	ICONS: 48,
	GRAPHICS: 24,
	ILLUSTRATIONS: 24,
} as const;

export const SITE_ORIGIN = "https://shumiyata.com/";
