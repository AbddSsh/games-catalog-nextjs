import { NextResponse } from "next/server";
import { BLOG_MOCK_ARTICLES } from "@/shared/mocks/blog/blog.mock.data";

interface IRouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: Request, context: IRouteParams) {
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

  const { slug } = await context.params;
  const article = BLOG_MOCK_ARTICLES.find((item) => item.slug === slug);

  if (!article) {
    return NextResponse.json(
      {
        statusCode: 404,
        message: `Blog article '${slug}' not found`,
        error: "Not Found",
        code: "BLOG_ARTICLE_NOT_FOUND",
      },
      { status: 404 }
    );
  }

  return NextResponse.json(article);
}
