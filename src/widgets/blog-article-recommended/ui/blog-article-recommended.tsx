import { ThumbsUp } from "lucide-react";
import {
  BlogArticleRecommendCard,
  type IBlogArticleRecommendedSection,
} from "@/entities/blog";

interface IBlogArticleRecommendedProps {
  locale: string;
  recommendedArticles?: IBlogArticleRecommendedSection;
}

export function BlogArticleRecommended({
  locale,
  recommendedArticles,
}: IBlogArticleRecommendedProps) {
  if (!recommendedArticles?.items?.length) {
    return null;
  }

  return (
    <section className="rounded-[18px] border border-[#A869E442] bg-[#FFFFFF0D] p-[22px]">
      <div className="flex items-center gap-3">
        <ThumbsUp className="h-6 w-6 text-[#FF4ECA]" strokeWidth={1.8} />
        <h3 className="text-[25px] font-medium leading-none text-[#FF4ECA]">
          {recommendedArticles.title}
        </h3>
      </div>

      <div className="mt-[22px]">
        {recommendedArticles.items.map((article, index) => (
          <div
            key={article.slug}
            className={index !== recommendedArticles.items.length - 1 ? "mb-[30px] border-b border-[#A869E44D] pb-[30px]" : ""}
          >
            <BlogArticleRecommendCard locale={locale} article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
