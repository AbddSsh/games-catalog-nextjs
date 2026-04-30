import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticleView } from "@/views/blog-article";
import {
  getAllBlogSlugs,
  getBlogArticleBySlug,
  getBlogReadersChoice,
} from "@/entities/blog";
import { getCategories } from "@/entities/category";
import { getTryThisWeekGames } from "@/entities/game";
import { getAlternatesLanguages, getCanonicalUrl } from "@/shared/lib";
import { ROUTES } from "@/shared/router";
import { getLocales } from "@/entities/locale";

interface IBlogArticlePageProps {
  params: Promise<{
    lang: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: IBlogArticlePageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const article = await getBlogArticleBySlug(slug, lang);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "Blog article not found",
    };
  }

  const pathSegments = `${ROUTES.BLOG.replace(/^\//, "")}/${slug}`;
  const languages = await getAlternatesLanguages(pathSegments);

  return {
    title: article.seo.title,
    description: article.seo.description,
    alternates: {
      canonical: getCanonicalUrl(lang, pathSegments),
      languages,
    },
  };
}

export async function generateStaticParams() {
  try {
    const [locales, slugs] = await Promise.all([
      getLocales(),
      getAllBlogSlugs(),
    ]);
    const activeLocales = locales.filter((locale) => locale.status === "active");
    const defaultLocale = activeLocales.find((locale) => locale.isDefault) || activeLocales[0];

    if (!defaultLocale) {
      return [];
    }

    return slugs.map((slug) => ({
      lang: defaultLocale.code,
      slug,
    }));
  } catch {
    return [];
  }
}

export default async function BlogArticlePage({
  params,
}: IBlogArticlePageProps) {
  const { lang, slug } = await params;

  const [article, readersChoice, categories, tryThisWeek] = await Promise.all([
    getBlogArticleBySlug(slug, lang),
    getBlogReadersChoice(lang, 5).then((response) => response.items),
    getCategories(lang),
    getTryThisWeekGames(lang),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <BlogArticleView
      locale={lang}
      article={article}
      readersChoice={readersChoice}
      categories={categories}
      tryThisWeek={tryThisWeek}
    />
  );
}
