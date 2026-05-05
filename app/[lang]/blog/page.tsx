import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogView } from "@/views/blog";
import {
  getBlogArticlesList,
  getBlogReadersChoice,
} from "@/entities/blog";
import { getCategories } from "@/entities/category";
import { getTryThisWeekGames } from "@/entities/game";
import { getTranslations } from "@/entities/translations";
import { getAlternatesLanguages, getCanonicalUrl } from "@/shared/lib";
import { ROUTES } from "@/shared/router";

const BLOG_DEFAULT_PAGE = 1;
const BLOG_DEFAULT_ELEMENTS = 4;
const BLOG_CATEGORY_ELEMENTS = 200;

interface IBlogPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    category?: string;
    q?: string;
    page?: string;
    elements?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({
  params,
}: IBlogPageProps): Promise<Metadata> {
  const { lang } = await params;
  const translations = await getTranslations(lang);
  const pathSegments = ROUTES.BLOG.replace(/^\//, "");
  const languages = await getAlternatesLanguages(pathSegments);

  return {
    title: `Blog | ${translations?.meta.default_title ?? "Games"}`,
    description: translations?.meta.default_description ?? "Game blog",
    alternates: {
      canonical: getCanonicalUrl(lang, pathSegments),
      languages,
    },
  };
}

export default async function BlogPage({
  params,
  searchParams,
}: IBlogPageProps) {
  const [{ lang }, search] = await Promise.all([params, searchParams]);

  const category = search.category?.trim() || undefined;
  const q = search.q?.trim();
  const qForApi = q && q.length >= 2 ? q : undefined;

  const isCategoryMode = Boolean(category);
  const parsedPage = search.page ? Number(search.page) : NaN;
  const parsedElements = search.elements ? Number(search.elements) : NaN;
  const page = isCategoryMode
    ? BLOG_DEFAULT_PAGE
    : Number.isFinite(parsedPage) && parsedPage > 0
      ? parsedPage
      : BLOG_DEFAULT_PAGE;
  const elements = isCategoryMode
    ? BLOG_CATEGORY_ELEMENTS
    : Number.isFinite(parsedElements) && parsedElements > 0
      ? parsedElements
      : BLOG_DEFAULT_ELEMENTS;
  const translations = await getTranslations(lang);
  const blogSortModal = translations?.blog.sortModal ?? {};
  const blogSortKeys = Object.keys(blogSortModal);
  const sort = search.sort && blogSortKeys.includes(search.sort)
    ? search.sort
    : blogSortKeys[0];

  const [listData, readersChoice, categories, tryThisWeek] = await Promise.all([
    getBlogArticlesList({
      locale: lang,
      category,
      q: qForApi,
      page,
      elements,
      sort,
    }),
    getBlogReadersChoice(lang, 5).then((response) => response.items),
    getCategories(lang),
    getTryThisWeekGames(lang),
  ]);

  if (!listData) {
    notFound();
  }

  const blogTranslations = translations?.blog ?? {
    title: listData.heroTitle,
    allArticles: "All Articles",
    findGameSection: {
      title: "Find your game",
      subtitle: "What genre do you prefer?",
      ctaText: "Show me games",
    },
    gamesSection: {
      title: "Try this week",
    },
    sortModal: {
      publishedAt_desc: "Latest",
      publishedAt_asc: "Oldest",
      reactions_desc: "Most Popular",
    },
    readersChoiceSection: {
      title: "Reader's Choice",
    },
    searchString: {
      placeholder: "Search articles",
    },
  };

  return (
    <BlogView
      locale={lang}
      listData={listData}
      readersChoice={readersChoice}
      categories={categories}
      tryThisWeek={tryThisWeek}
      activeCategory={category}
      searchQuery={q}
      currentSort={sort}
      translations={blogTranslations}
    />
  );
}
