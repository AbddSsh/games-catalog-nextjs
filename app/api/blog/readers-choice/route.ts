import { NextResponse } from "next/server";
import type { IBlogArticleCard } from "@/entities/blog";
import {
  BLOG_MOCK_ARTICLE_CHIP,
  BLOG_MOCK_ARTICLES,
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

  const page = parsePositiveInt(searchParams.get("page"), 1);
  const elements = parsePositiveInt(searchParams.get("elements"), 3);

  const sorted = BLOG_MOCK_ARTICLES.map(toCard).sort((a, b) => {
    if (b.reactionsCount !== a.reactionsCount) {
      return b.reactionsCount - a.reactionsCount;
    }
    const dateDiff = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    if (dateDiff !== 0) {
      return dateDiff;
    }
    return a.slug.localeCompare(b.slug);
  });

  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / elements));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * elements;
  const items = sorted.slice(offset, offset + elements);

  return NextResponse.json({
    activeChip: "all",
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
