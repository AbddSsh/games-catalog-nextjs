"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib";
import {
  ENUM_SF_KIND,
  type TSpecialFeatureBlock,
  type IBlockSystemRequirements,
  type IBlockKeyFeaturesGrid,
  type IBlockProsCons,
  type IBlockCtaFooter,
} from "@/entities/game";

interface IGameFeaturesBlocksProps {
  blocks: TSpecialFeatureBlock[];
  trackingCtaUrl?: string;
}

export function GameFeaturesBlocks({ blocks, trackingCtaUrl }: IGameFeaturesBlocksProps) {
  return (
    <div className="space-y-5 rounded-[13px] bg-[#0C0E1A] px-5 py-7">
      {blocks.map((block, i) => (
        <FeatureBlock key={i} block={block} trackingCtaUrl={trackingCtaUrl} />
      ))}
    </div>
  );
}

function FeatureBlock({
  block,
  trackingCtaUrl,
}: {
  block: TSpecialFeatureBlock;
  trackingCtaUrl?: string;
}) {
  switch (block.kind) {
    case ENUM_SF_KIND.SYSTEM_REQUIREMENTS:
      return <SystemRequirements block={block} />;
    case ENUM_SF_KIND.KEY_FEATURES_GRID:
      return <KeyFeaturesGrid block={block} />;
    case ENUM_SF_KIND.PROS_CONS:
      return <ProsCons block={block} />;
    case ENUM_SF_KIND.CTA_FOOTER:
      return <CtaFooter block={block} trackingCtaUrl={trackingCtaUrl} />;
    default:
      return null;
  }
}

function SystemRequirements({ block }: { block: IBlockSystemRequirements }) {
  return (
    <div className="space-y-2.5">
      <p className="text-lg font-bold text-text-primary">{block.label}</p>
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <RequirementsColumn
          variant="minimum"
          title={block.minimumLabel}
          items={block.minimum}
        />
        <RequirementsColumn
          variant="recommended"
          title={block.recommendedLabel}
          items={block.recommended}
        />
      </div>
    </div>
  );
}

function RequirementsColumn({
  variant,
  title,
  items,
}: {
  variant: "minimum" | "recommended";
  title: string;
  items: { label: string; value: string }[];
}) {
  const skin =
    variant === "minimum"
      ? {
          shell: "border-[#262845]",
          heading: "text-[#A869E4]",
        }
      : {
          shell: "border-[#E660EB]",
          heading: "text-[#E660EB]",
        };

  return (
    <div className={cn("rounded-[13px] border-[1px] p-6 bg-[#16172C]", skin.shell)}>
      <h4
        className={cn(
          "mb-4 text-sm font-bold uppercase",
          skin.heading
        )}
      >
        {title}
      </h4>
      <dl className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex justify-start gap-1 text-sm">
            <dt className="text-text-primary font-medium">{item.label}:</dt>
            <dd className="font-normal text-[#6C6A80]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function KeyFeaturesGrid({ block }: { block: IBlockKeyFeaturesGrid }) {
  const COUNT = block.items.length;
  const gridCols =
    COUNT <= 1
      ? "grid-cols-1"
      : COUNT === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text-primary">
        {block.label}
      </h3>
      <div className={cn("grid gap-2", gridCols)}>
        {block.items.map((item, index) => (
            <aside
              className="h-fit rounded-[13px] p-[1px]"
              style={{
                background:
                  "linear-gradient(90deg, #6A85B0 0%, #2F2D42 50%, #4B2A66 100%)",
              }}
              key={index}
            >
            <div
              key={item.templateSlug}
              className="flex flex-col items-center gap-3 rounded-[12px] bg-[#16172C] py-3 text-center"
            >
              <Image
                src={item.iconUrl}
                alt={item.name}
                width={48}
                height={48}
                className="size-12 object-contain"
              />
              <span className="text-sm font-medium text-text-primary">
                {item.name}
              </span>
            </div>
          </aside>
        ))}
      </div>
    </div>
  );
}

function ProsCons({ block }: { block: IBlockProsCons }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-text-primary">
        {block.label}
      </h3>
      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
        <div className="rounded-[13px] border-[1px] border-[#8BDB65] bg-[#16172C] p-6">
          <h4 className="mb-4 uppercase text-sm font-bold text-[#8BDB65]">
            {block.prosLabel}
          </h4>
          <ul className="space-y-1.5">
            {block.pros.map((pro, i) => (
              <li
                key={i}
                className="flex items-start gap-1.5 text-sm leading-snug text-text-primary"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border-[2px] border-[#8BDB65]/55 text-[#8BDB65]">
                  <Plus className="size-3" strokeWidth={2.5} aria-hidden />
                </span>
                <div className="flex justify-start gap-1 text-sm">
                  <span className="text-text-primary font-medium">{pro.label}:</span>
                  <span className="font-normal text-[#6C6A80]">{pro.value}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[13px] border-[1px] border-[#FF686B] bg-[#16172C] p-6">
          <h4 className="mb-4 uppercase text-sm font-bold text-[#F472B8]">
            {block.consLabel}
          </h4>
          <ul className="space-y-1.5">
            {block.cons.map((con, i) => (
              <li
                key={i}
                className="flex items-start gap-1.5 text-sm leading-snug text-text-primary"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border-[2px] border-[#FF686B]/55 text-[#FF686B]">
                  <Minus className="size-3" strokeWidth={2.5} aria-hidden />
                </span>
                <div className="flex justify-start gap-1 text-sm">
                  <span className="text-text-primary font-medium">{con.label}:</span>
                  <span className="font-normal text-[#6C6A80]">{con.value}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function CtaFooter({
  block,
  trackingCtaUrl,
}: {
  block: IBlockCtaFooter;
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
