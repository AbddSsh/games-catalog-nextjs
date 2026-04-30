import type { ICategoryCard } from "@/entities/category";
import type { IGameBase } from "@/entities/game";
import type { IBlogArticleCard, IBlogArticleDetail } from "@/entities/blog";
import { BlogSidebar } from "@/widgets/blog-sidebar";
import { BlogReadersChoice } from "@/widgets/blog-readers-choice";
import { BlogArticleContent } from "@/widgets/blog-article-content";
import { Breadcrumbs } from "@/shared/ui";
import { getBlogRoute } from "@/shared/router";
import { localePath } from "@/shared/lib";

interface IBlogArticleViewProps {
  locale: string;
  article: IBlogArticleDetail;
  readersChoice: IBlogArticleCard[];
  categories: ICategoryCard[];
  tryThisWeek: IGameBase[];
}

export function BlogArticleView({
  locale,
  article,
  readersChoice,
  categories,
  tryThisWeek,
}: IBlogArticleViewProps) {
  const breadcrumbs = [
    { label: "Home", href: localePath(locale) },
    { label: "Blog", href: localePath(locale, getBlogRoute()) },
    { label: article.articleHeader.title },
  ];

  return (
    <div className="space-y-8 pb-6 pt-[24px] max-w-[1080px] mx-auto">
      <Breadcrumbs items={breadcrumbs} className="text-xs text-text-muted" />

      <div className="grid gap-6 laptop:grid-cols-[minmax(0,1fr)_300px] laptop:gap-5 desktop:grid-cols-[minmax(0,1fr)_320px]">
        <BlogArticleContent article={article} />
        <BlogSidebar
          locale={locale}
          categories={categories}
          tryThisWeek={tryThisWeek}
        />
      </div>

      <BlogReadersChoice locale={locale} items={readersChoice} />
    </div>
  );
}
