// src/layouts/LayoutProps.ts
import type { Blog, Category, Tag } from "../libs/microcms.ts";

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
  isWorksPage?: boolean;
}
