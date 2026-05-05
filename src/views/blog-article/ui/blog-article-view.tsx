import type { IBlogArticleCard, IBlogArticleDetail } from "@/entities/blog";
import type { ITranslationsBlog } from "@/entities/translations";
import { BlogReadersChoice } from "@/widgets/blog-readers-choice";
import { BlogArticleRecommended } from "@/widgets/blog-article-recommended";
import { BlogArticleContent } from "@/widgets/blog-article-content";
import { Breadcrumbs } from "@/shared/ui";
import { getBlogRoute } from "@/shared/router";
import { localePath } from "@/shared/lib";

interface IBlogArticleViewProps {
  locale: string;
  article: IBlogArticleDetail;
  readersChoice: IBlogArticleCard[];
  translations: ITranslationsBlog;
}

export function BlogArticleView({
  locale,
  article,
  readersChoice,
  translations,
}: IBlogArticleViewProps) {
  const breadcrumbs = [
    { label: "Home", href: localePath(locale) },
    { label: translations.title, href: localePath(locale, getBlogRoute()) },
    { label: article.articleHeader.title },
  ];

  return (
    <div className="space-y-8 pb-6 pt-[24px] max-w-[1080px] mx-auto">
      <Breadcrumbs items={breadcrumbs} className="text-xs text-text-muted" />

      <div className="grid gap-6 laptop:grid-cols-[minmax(0,1fr)_300px] laptop:gap-5 desktop:grid-cols-[minmax(0,1fr)_320px]">
        <BlogArticleContent article={article} />
        <aside className="space-y-3">
          <BlogArticleRecommended
            locale={locale}
            recommendedArticles={article.recommendedArticles}
          />
        </aside>
      </div>

      <BlogReadersChoice
        locale={locale}
        items={readersChoice}
        title={translations.readersChoiceSection.title}
      />
    </div>
  );
}
