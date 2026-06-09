import { getContents } from "./microcms";
import { WORK_FILTERS } from "./constants";
import type { Icon } from "../types";

export interface WorkTypeAvailability {
	hasWebsite: boolean;
	hasProduct: boolean;
	hasGraphic: boolean;
	hasIllust: boolean;
	hasIcon: boolean;
}

export async function getWorkTypeAvailability(): Promise<WorkTypeAvailability> {
	const [websiteCheck, productCheck, graphicCheck, illustCheck, iconCheck] = await Promise.all([
		getContents<Icon>("works", { limit: 1, filters: WORK_FILTERS.WEBSITE }),
		getContents<Icon>("works", { limit: 1, filters: WORK_FILTERS.PRODUCT }),
		getContents<Icon>("works", { limit: 1, filters: WORK_FILTERS.GRAPHIC }),
		getContents<Icon>("works", { limit: 1, filters: WORK_FILTERS.ILLUSTRATION }),
		getContents<Icon>("works", { limit: 1, filters: WORK_FILTERS.ICON }),
	]);
	return {
		hasWebsite: websiteCheck.totalCount > 0,
		hasProduct: productCheck.totalCount > 0,
		hasGraphic: graphicCheck.totalCount > 0,
		hasIllust: illustCheck.totalCount > 0,
		hasIcon: iconCheck.totalCount > 0,
	};
}

type PortfolioPage = "website" | "product" | "graphic" | "illustration" | "icon";

interface NavItem {
	href: string;
	label: string;
	tooltip: string;
	isActive: boolean;
	current?: boolean;
}

export function buildPortfolioNavItems(availability: WorkTypeAvailability, current?: PortfolioPage): NavItem[] {
	const { hasWebsite, hasProduct, hasGraphic, hasIllust, hasIcon } = availability;

	const items: NavItem[] = [
		{ href: "/portfolio/website", label: "Website", tooltip: "ウェブサイト", isActive: hasWebsite },
	];
	if (hasProduct) items.push({ href: "/portfolio/product", label: "Product", tooltip: "プロダクト", isActive: true });
	if (hasGraphic) items.push({ href: "/portfolio/graphic", label: "Graphic", tooltip: "グラフィック", isActive: true });
	if (hasIllust)
		items.push({ href: "/portfolio/illustration", label: "Illustration", tooltip: "イラスト", isActive: true });
	if (hasIcon) items.push({ href: "/portfolio/icon", label: "Icon", tooltip: "アイコン", isActive: true });

	if (current) {
		const currentItem = items.find((item) => item.href === `/portfolio/${current}`);
		if (currentItem) currentItem.current = true;
	}

	return items;
}
