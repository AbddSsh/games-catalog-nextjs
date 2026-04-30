import Image from "next/image";
import { Flame, Minus } from "lucide-react";
import { BlogArticleBlocks, type IBlogArticleDetail } from "@/entities/blog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button } from "@/shared/ui";
import Link from "next/link";

interface IBlogArticleContentProps {
  article: IBlogArticleDetail;
}

function formatMetaDate(dateIso: string): string {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogArticleContent({ article }: IBlogArticleContentProps) {
  const { articleHeader, articleBody, articleFooter } = article;

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <h1 className="max-w-[860px] text-[34px] font-extrabold leading-[1.15] text-text-primary laptop:text-[42px]">
          {articleHeader.title}
        </h1>
        {articleHeader.subtitle ? (
          <p className="max-w-[820px] text-[18px] font-normal leading-[1] text-[#FFFFFF99]">
            {articleHeader.subtitle}
          </p>
        ) : null}
      </header>

      {articleHeader.headerImage ? (
        <div className="overflow-hidden rounded-xl border border-border-main">
          <Image
            src={articleHeader.headerImage}
            alt={articleHeader.title}
            width={1200}
            height={560}
            className="h-auto w-full object-cover"
            priority
          />
        </div>
      ) : null}
      <div className="flex w-full flex-wrap items-center gap-3 text-[16px] font-bold uppercase leading-[1] text-[#A869E4]">
        <span>{formatMetaDate(articleHeader.publishedAt)}</span>
        {articleHeader.readMinutes ? <span>• {articleHeader.readMinutes} min</span> : null}
        <span className="ml-auto inline-flex items-center gap-1 text-[#FF8A55]">
          <Flame className="h-4 w-4 fill-current" />
          {articleHeader.reactionsCount}
        </span>
      </div>

      <BlogArticleBlocks blocks={articleBody.blocks} />

      <footer className="space-y-8">
        {articleFooter.FAQBlock ? (
          <div className="rounded-[13px] bg-[#0C0E1A] p-5">
            <h3 className="mb-3 text-[18px] font-bold leading-[1] text-white">{articleFooter.FAQBlock.title}</h3>
            <Accordion
              type="single"
              collapsible
              defaultValue={articleFooter.FAQBlock.items.length > 0 ? "faq-0" : undefined}
              className="space-y-[11px]"
            >
              {articleFooter.FAQBlock.items.map((faq, index) => (
                <AccordionItem
                  key={`${faq.question}-${index}`}
                  value={`faq-${index}`}
                  className="rounded-[13px] border border-[#A869E438] bg-[#16172C] p-5"
                >
                  <AccordionTrigger className="py-0 text-left text-[18px] font-bold leading-[1] text-white hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="mt-4 border-t border-[#A869E438] pb-0 pt-4 text-[18px] font-normal leading-[1] text-[#CDCDCD]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : null}

        {articleFooter.isLiked ? (
          <div className="inline-block max-w-full rounded-[22px] border border-[#5D3A7E] bg-[#FFFFFF08] p-[22px]">
            <div className="flex w-fit max-w-full flex-wrap items-center gap-4 rounded-[22px]">
              <p className="pr-12 text-[23.56px] font-extrabold uppercase leading-[1] text-white">
                {articleFooter.isLiked.label}
              </p>
              <div className="ml-auto flex items-center gap-4">
                <button
                  type="button"
                  className="inline-flex items-center gap-3 rounded-[14px] border border-[#A869E4] bg-[linear-gradient(0deg,rgba(255,255,255,0.12),rgba(255,255,255,0.12)),linear-gradient(0deg,rgba(168,105,228,0.26),rgba(168,105,228,0.26))] px-6 py-3 text-[23.56px] font-extrabold uppercase leading-[1] text-white shadow-[0px_0px_6.7px_0px_#A869E4]"
                >
                  <Flame className="h-8 w-8 fill-[#FF8A55] text-[#FF8A55]" />
                  {articleFooter.isLiked.yesLabel}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-3 rounded-[14px] border border-[#8F8F8F] bg-[#FFFFFF1F] px-6 py-3 text-[23.56px] font-extrabold uppercase leading-[1] text-white"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#D9D9D994]">
                    <Minus className="h-5 w-5 text-[#4A4A4A]" />
                  </span>
                  {articleFooter.isLiked.noLabel}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {articleFooter.bottomCTA ? (
          <div className="rounded-[13px] bg-[#0C0E1A] p-8">
            <div className="space-y-5 text-center">
              <h3 className="text-[27.67px] font-bold leading-[1] text-white">
                {articleFooter.bottomCTA.title}
              </h3>
              <p className="text-[20.15px] font-normal leading-[1] text-[#FFFFFF80]">
                {articleFooter.bottomCTA.captions.join(" • ")}
              </p>
              <Button
                asChild
                className="mx-auto rounded-[28px] bg-[#A4115E] px-[40px] py-[24px] text-[16.8px] font-bold uppercase leading-[1] text-white hover:bg-[#A4115E]/90"
                style={{
                  boxShadow: "0px 4px 4px 0px #00000040, inset 0px 2px 4px 0px #FFFFFF40",
                }}
              >
                <Link href={articleFooter.bottomCTA.ctaUrl} target="_blank" rel="noreferrer">
                  {articleFooter.bottomCTA.ctaText}
                </Link>
              </Button>
            </div>
          </div>
        ) : null}
      </footer>
    </article>
  );
}
