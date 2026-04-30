import { NextResponse } from "next/server";
import type { IBlogArticleCard } from "@/entities/blog";
import {
  BLOG_MOCK_ARTICLE_CHIP,
  BLOG_MOCK_ARTICLES,
  BLOG_MOCK_CHIPS,
  BLOG_MOCK_HERO_TITLE_BY_LOCALE,
} from "@/shared/mocks/blog/blog.mock.data";

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toCard(article: (typeof BLOG_MOCK_ARTICLES)[number]): IBlogArticleCard {
  const chip = BLOG_MOCK_ARTICLE_CHIP[article.slug];

  return {
    slug: article.slug,
    title: article.articleHeader.title,
    description: article.articleHeader.subtitle || "",
    bannerImage: article.articleHeader.headerImage,
    publishedAt: article.articleHeader.publishedAt,
    readMinutes: article.articleHeader.readMinutes,
    rating: article.articleHeader.rating,
    reactionsCount: article.articleHeader.reactionsCount,
    chip,
  };
}

function sortByPublishedAt(cards: IBlogArticleCard[], sort: string): IBlogArticleCard[] {
  return [...cards].sort((a, b) => {
    const aTs = new Date(a.publishedAt).getTime();
    const bTs = new Date(b.publishedAt).getTime();
    if (sort === "publishedAt_asc") {
      return aTs - bTs;
    }
    return bTs - aTs;
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const locale = searchParams.get("locale");
  if (!locale) {
    return NextResponse.json(
      {
        statusCode: 400,
        message: "locale query is required",
        error: "Bad Request",
        code: "MISSING_LOCALE",
      },
      { status: 400 }
    );
  }

  const chip = searchParams.get("chip") || "all";
  const q = searchParams.get("q")?.trim() || "";
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const elements = parsePositiveInt(searchParams.get("elements"), 12);
  const sort = searchParams.get("sort") || "publishedAt_desc";

  let cards = BLOG_MOCK_ARTICLES.map(toCard);

  if (chip !== "all") {
    cards = cards.filter((item) => item.chip?.slug === chip);
  }

  if (q.length >= 2) {
    const qLower = q.toLowerCase();
    cards = cards.filter((item) => {
      const article = BLOG_MOCK_ARTICLES.find((entry) => entry.slug === item.slug);
      const bodyText =
        article?.articleBody.blocks
          .map((block) => JSON.stringify(block))
          .join(" ")
          .toLowerCase() || "";

      return (
        item.title.toLowerCase().includes(qLower) ||
        item.description.toLowerCase().includes(qLower) ||
        bodyText.includes(qLower)
      );
    });
  }

  cards = sortByPublishedAt(cards, sort);

  const totalItems = cards.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / elements));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * elements;
  const items = cards.slice(offset, offset + elements);

  const allPublished = sortByPublishedAt(BLOG_MOCK_ARTICLES.map(toCard), "publishedAt_desc");
  const primary =
    allPublished.find((item) => item.slug === "best-free-strategy-games-2026") ||
    allPublished[0] ||
    null;
  const secondary = [...allPublished]
    .filter((item) => item.slug !== primary?.slug)
    .sort((a, b) => {
      if (b.reactionsCount !== a.reactionsCount) {
        return b.reactionsCount - a.reactionsCount;
      }
      const dateDiff = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      if (dateDiff !== 0) {
        return dateDiff;
      }
      return a.slug.localeCompare(b.slug);
    })
    .slice(0, 2);

  return NextResponse.json({
    heroTitle: BLOG_MOCK_HERO_TITLE_BY_LOCALE[locale] || BLOG_MOCK_HERO_TITLE_BY_LOCALE.en,
    heroArticles: {
      primary,
      secondary,
    },
    activeChip: chip,
    chips: BLOG_MOCK_CHIPS,
    searchQuery: q.length >= 2 ? q : undefined,
    items,
    pagination: {
      page: safePage,
      elements,
      totalPages,
      totalItems,
      hasMore: safePage < totalPages,
    },
  });
}
