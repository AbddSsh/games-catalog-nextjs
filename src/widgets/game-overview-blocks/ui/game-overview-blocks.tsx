"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/ui";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/shared/ui";
import {
  ENUM_GO_KIND,
  type ENUM_GO_KIND_TYPE,
  type TGameOverviewBlock,
  type IBlockSectionHeading,
  type IBlockTitleBody,
  type IBlockParagraph,
  type IBlockStepsRow,
  type IBlockFaqSection,
  type IBlockCtaBanner,
  type IBlockBottomCta,
} from "@/entities/game";

interface IGameOverviewBlocksProps {
  blocks: TGameOverviewBlock[];
  trackingCtaUrl?: string;
}

export function GameOverviewBlocks({ blocks, trackingCtaUrl }: IGameOverviewBlocksProps) {
  const TOP_GROUP_KINDS = new Set<ENUM_GO_KIND_TYPE>([
    ENUM_GO_KIND.SECTION_HEADING,
    ENUM_GO_KIND.TITLE_BODY,
    ENUM_GO_KIND.PARAGRAPH,
    ENUM_GO_KIND.CTA_BANNER,
    ENUM_GO_KIND.STEPS_ROW,
  ]);
  const TOP_GROUP_END_KINDS = new Set<ENUM_GO_KIND_TYPE>([
    ENUM_GO_KIND.FAQ_SECTION,
    ENUM_GO_KIND.BOTTOM_CTA,
  ]);

  const TOP_GROUP_BLOCKS: TGameOverviewBlock[] = [];
  let TOP_GROUP_ENDED = false;

  for (const block of blocks) {
    if (TOP_GROUP_END_KINDS.has(block.kind)) {
      TOP_GROUP_ENDED = true;
      continue;
    }

    if (!TOP_GROUP_ENDED && TOP_GROUP_KINDS.has(block.kind)) {
      TOP_GROUP_BLOCKS.push(block);
    }
  }

  const USED_IN_TOP_GROUP = new Set(TOP_GROUP_BLOCKS);
  const REMAINING_BLOCKS = blocks.filter((block) => !USED_IN_TOP_GROUP.has(block));

  return (
    <div className="space-y-2.5">
      {TOP_GROUP_BLOCKS.length > 0 && (
        <div className="space-y-6 rounded-[13px] bg-[#0C0E1A] p-6">
          {TOP_GROUP_BLOCKS.map((block, i) => (
            <OverviewBlock key={`top-${block.kind}-${i}`} block={block} trackingCtaUrl={trackingCtaUrl} />
          ))}
        </div>
      )}

      {REMAINING_BLOCKS.map((block, i) => (
        <OverviewBlock key={i} block={block} trackingCtaUrl={trackingCtaUrl} />
      ))}
    </div>
  );
}

function OverviewBlock({
  block,
  trackingCtaUrl,
}: {
  block: TGameOverviewBlock;
  trackingCtaUrl?: string;
}) {
  switch (block.kind) {
    case ENUM_GO_KIND.SECTION_HEADING:
      return <SectionHeading block={block} />;
    case ENUM_GO_KIND.TITLE_BODY:
      return <TitleBody block={block} />;
    case ENUM_GO_KIND.PARAGRAPH:
      return <Paragraph block={block} />;
    case ENUM_GO_KIND.STEPS_ROW:
      return <StepsRow block={block} />;
    case ENUM_GO_KIND.FAQ_SECTION:
      return (
        <div className="rounded-[13px] bg-[#0C0E1A] p-6">
          <FaqSection block={block} />
        </div>
      );
    case ENUM_GO_KIND.CTA_BANNER:
      return <CtaBanner block={block} trackingCtaUrl={trackingCtaUrl} />;
    case ENUM_GO_KIND.BOTTOM_CTA:
      return (
        <div className="rounded-[13px] bg-[#0C0E1A]">
          <BottomCta block={block} trackingCtaUrl={trackingCtaUrl} />
        </div>
      );
    default:
      return null;
  }
}

function SectionHeading({ block }: { block: IBlockSectionHeading }) {
  return (
    <h2 className="text-xl font-black uppercase text-text-primary">
      {block.heading}
    </h2>
  );
}

function TitleBody({ block }: { block: IBlockTitleBody }) {
  return (
    <div className="">
      <h3 className="mb-3 text-lg font-black text-[#E660EB]">
        {block.title}
      </h3>
      <div
        className="text-sm font-normal leading-relaxed text-[#CDCDCD]"
        dangerouslySetInnerHTML={{ __html: block.text }}
      />
    </div>
  );
}

function Paragraph({ block }: { block: IBlockParagraph }) {
  return (
    <div
      className="text-sm font-normal leading-relaxed text-[#CDCDCD]"
      dangerouslySetInnerHTML={{ __html: block.text }}
    />
  );
}

function StepsRow({ block }: { block: IBlockStepsRow }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {block.steps.map((step) => (
        <div
          key={step.position}
          className="flex items-start gap-4 rounded-[13px] bg-[#16172C] px-4 py-5"
        >
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#8A3D77] border-[1px] border-[#D9D9D9] text-lg font-bold text-white">
            {step.position}
          </span>
          <div>
            <p className="text-sm font-bold text-text-primary">{step.label}</p>
            <p className="mt-0.5 text-xs text-text-secondary">{step.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FaqSection({ block }: { block: IBlockFaqSection }) {
  return (
    <div className="space-y-3">
      {block.title && (
        <h3 className="text-lg font-black text-text-primary">{block.title}</h3>
      )}
      <Accordion
        type="single"
        collapsible
        defaultValue={block.items.length > 0 ? "faq-0" : undefined}
        className="space-y-2"
      >
        {block.items.map((item, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="overflow-hidden rounded-[13px] border border-[#3C3C50] bg-[#16172C] px-4"
          >
            <AccordionTrigger className="text-sm font-bold text-text-primary hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-[#CDCDCD] pt-4 border-t-[1px] border-[rgba(168,105,228,0.22)]">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function CtaBanner({
  block,
  trackingCtaUrl,
}: {
  block: IBlockCtaBanner;
  trackingCtaUrl?: string;
}) {
  const CTA_URL = trackingCtaUrl || block.ctaUrl;

  return (
    <div className="relative flex items-center gap-5 rounded-[13px] bg-[#250B3C] px-7 py-6">
      {block.iconUrl && (
        <Image
          src={block.iconUrl}
          alt=""
          width={90}
          height={90}
          className="h-auto w-full max-w-[90px]"
        />
      )}
      <div className="flex-1 space-y-2">
        <p className="text-base font-bold text-text-primary">{block.title}</p>
        <p className="text-xs text-[#CDCDCD]">{block.body}</p>
      </div>
      <Link href={CTA_URL} target="_blank">
        <Button className="rounded-full bg-button px-20 py-2.5 text-sm font-bold uppercase text-white hover:bg-button/90">
          {block.ctaText}
        </Button>
      </Link>
    </div>
  );
}

function BottomCta({
  block,
  trackingCtaUrl,
}: {
  block: IBlockBottomCta;
  trackingCtaUrl?: string;
}) {
  const CTA_URL = trackingCtaUrl || block.ctaUrl;

  return (
    <section className="px-6 py-10">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-3xl font-bold text-text-primary">
          {block.title}
        </h3>
        {block.captions.length > 0 && (
          <p className="mt-2 text-xl text-[#CDCDCD] font-normal">
            {block.captions.join(" \u2022 ")}
          </p>
        )}
        <Link
          href={CTA_URL}
          target="_blank"
          className="mt-5"
        >
          <Button className="rounded-full bg-[#A4115E] px-20 py-3 text-base font-bold uppercase text-white shadow-[0px_4px_4px_0px_#00000040,0px_2px_4px_0px_#FFFFFF40_inset] hover:bg-[#A4115E]/90">
            {block.ctaText}
          </Button>
        </Link>
      </div>
    </section>
  );
}
