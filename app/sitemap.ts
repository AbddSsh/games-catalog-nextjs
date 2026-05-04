import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "@/shared/lib";
import { ROUTES } from "@/shared/router";
import { getLocales } from "@/entities/locale";
import { getAllCategorySlugs } from "@/entities/category";
import { getAllGameSlugs } from "@/entities/game";
import { getAllBlogSlugs } from "@/entities/blog";

const STATIC_PATH_SEGMENTS = [
  "", // home
  ROUTES.CATALOG.replace(/^\//, ""), // catalog
  ROUTES.BLOG.replace(/^\//, ""), // blog
  ROUTES.PROMO.replace(/^\//, ""), // promo
  ROUTES.SAVED.replace(/^\//, ""), // saved
  ROUTES.PRIVACY.replace(/^\//, ""), // privacy
  ROUTES.CONTACT_US.replace(/^\//, ""), // contact-us
  ROUTES.SITEMAP.replace(/^\//, ""), // sitemap
] as const;

function toSitemapEntry(
  url: string,
  priority: number = 0.7,
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" = "monthly"
): MetadataRoute.Sitemap[number] {
  return {
    url,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [locales, categorySlugs, gameSlugs, blogSlugs] = await Promise.all([
    getLocales(),
    getAllCategorySlugs(),
    getAllGameSlugs(),
    getAllBlogSlugs(),
  ]);

  const activeLocales = locales.filter((l) => l.status === "active");
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of activeLocales) {
    const lang = locale.code;

    for (const pathSegments of STATIC_PATH_SEGMENTS) {
      const url = getCanonicalUrl(lang, pathSegments || undefined);
      entries.push(
        toSitemapEntry(
          url,
          pathSegments === "" ? 0.9 : 0.7
        )
      );
    }

    for (const slug of categorySlugs) {
      const pathSegments = `${ROUTES.CATEGORY.replace(/^\//, "")}/${slug}`;
      entries.push(toSitemapEntry(getCanonicalUrl(lang, pathSegments), 0.7));
    }

    for (const slug of gameSlugs) {
      const pathSegments = `${ROUTES.GAME.replace(/^\//, "")}/${slug}`;
      entries.push(toSitemapEntry(getCanonicalUrl(lang, pathSegments), 0.6));
    }

    for (const slug of blogSlugs) {
      const pathSegments = `${ROUTES.BLOG.replace(/^\//, "")}/${slug}`;
      entries.push(toSitemapEntry(getCanonicalUrl(lang, pathSegments), 0.6));
    }
  }

  return entries;
}
